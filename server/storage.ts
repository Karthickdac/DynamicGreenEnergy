import { type User, type InsertUser, type Quotation, type InsertQuotation, type QuotationItem, type InsertQuotationItem, type QuotationWithItems } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getQuotations(): Promise<Quotation[]>;
  getQuotation(id: string): Promise<QuotationWithItems | undefined>;
  createQuotation(quotation: InsertQuotation, items: Omit<InsertQuotationItem, "quotationId">[]): Promise<QuotationWithItems>;
  updateQuotation(id: string, quotation: Partial<InsertQuotation>, items: Omit<InsertQuotationItem, "quotationId">[]): Promise<QuotationWithItems | undefined>;
  deleteQuotation(id: string): Promise<boolean>;
  getNextQuotationNumber(): Promise<string>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quotations: Map<string, Quotation>;
  private quotationItems: Map<string, QuotationItem>;
  private quotationCounter: number;

  constructor() {
    this.users = new Map();
    this.quotations = new Map();
    this.quotationItems = new Map();
    this.quotationCounter = 0;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getNextQuotationNumber(): Promise<string> {
    this.quotationCounter++;
    const year = new Date().getFullYear();
    const seq = String(this.quotationCounter).padStart(5, "0");
    return `QT-${year}-${seq}`;
  }

  async getQuotations(): Promise<Quotation[]> {
    return Array.from(this.quotations.values()).sort((a, b) =>
      b.createdDate.localeCompare(a.createdDate)
    );
  }

  async getQuotation(id: string): Promise<QuotationWithItems | undefined> {
    const quotation = this.quotations.get(id);
    if (!quotation) return undefined;
    const items = Array.from(this.quotationItems.values())
      .filter((item) => item.quotationId === id)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return { ...quotation, items };
  }

  async createQuotation(
    quotation: InsertQuotation,
    items: Omit<InsertQuotationItem, "quotationId">[]
  ): Promise<QuotationWithItems> {
    const id = randomUUID();
    const newQuotation: Quotation = { ...quotation, id, notes: quotation.notes ?? null };
    this.quotations.set(id, newQuotation);

    const savedItems: QuotationItem[] = items.map((item, idx) => {
      const itemId = randomUUID();
      const newItem: QuotationItem = {
        ...item,
        id: itemId,
        quotationId: id,
        sortOrder: item.sortOrder ?? idx,
      };
      this.quotationItems.set(itemId, newItem);
      return newItem;
    });

    return { ...newQuotation, items: savedItems };
  }

  async updateQuotation(
    id: string,
    quotation: Partial<InsertQuotation>,
    items: Omit<InsertQuotationItem, "quotationId">[]
  ): Promise<QuotationWithItems | undefined> {
    const existing = this.quotations.get(id);
    if (!existing) return undefined;

    const updated: Quotation = { ...existing, ...quotation };
    this.quotations.set(id, updated);

    for (const [itemId, item] of this.quotationItems.entries()) {
      if (item.quotationId === id) {
        this.quotationItems.delete(itemId);
      }
    }

    const savedItems: QuotationItem[] = items.map((item, idx) => {
      const itemId = randomUUID();
      const newItem: QuotationItem = {
        ...item,
        id: itemId,
        quotationId: id,
        sortOrder: item.sortOrder ?? idx,
      };
      this.quotationItems.set(itemId, newItem);
      return newItem;
    });

    return { ...updated, items: savedItems };
  }

  async deleteQuotation(id: string): Promise<boolean> {
    if (!this.quotations.has(id)) return false;
    this.quotations.delete(id);
    for (const [itemId, item] of this.quotationItems.entries()) {
      if (item.quotationId === id) {
        this.quotationItems.delete(itemId);
      }
    }
    return true;
  }
}

export const storage = new MemStorage();
