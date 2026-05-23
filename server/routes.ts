import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const quotationItemInputSchema = z.object({
  itemName: z.string().min(1),
  qty: z.number().positive(),
  unit: z.string().min(1),
  rate: z.number().min(0),
  discountPercent: z.number().min(0).max(100).default(0),
  gstPercent: z.number().min(0).default(18),
  sortOrder: z.number().int().default(0),
});

const createQuotationSchema = z.object({
  number: z.string().optional(),
  type: z.string().min(1),
  customerName: z.string().min(1),
  createdDate: z.string().min(1),
  validUntil: z.string().min(1),
  status: z.string().default("draft"),
  notes: z.string().optional(),
  items: z.array(quotationItemInputSchema).min(1),
});

const updateQuotationSchema = createQuotationSchema.partial();

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get("/api/quotations", async (_req, res) => {
    const quotations = await storage.getQuotations();
    res.json(quotations);
  });

  app.get("/api/quotations/:id", async (req, res) => {
    const quotation = await storage.getQuotation(req.params.id);
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });
    res.json(quotation);
  });

  app.post("/api/quotations", async (req, res) => {
    const parsed = createQuotationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

    const { items, number, ...rest } = parsed.data;
    const quotationNumber = number || (await storage.getNextQuotationNumber());

    const quotation = await storage.createQuotation(
      { ...rest, number: quotationNumber, notes: rest.notes ?? null },
      items
    );
    res.status(201).json(quotation);
  });

  app.put("/api/quotations/:id", async (req, res) => {
    const parsed = updateQuotationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

    const { items, ...rest } = parsed.data;
    const quotation = await storage.updateQuotation(
      req.params.id,
      { ...rest, notes: rest.notes ?? null },
      items || []
    );
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });
    res.json(quotation);
  });

  app.delete("/api/quotations/:id", async (req, res) => {
    const deleted = await storage.deleteQuotation(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Quotation not found" });
    res.status(204).send();
  });

  return httpServer;
}
