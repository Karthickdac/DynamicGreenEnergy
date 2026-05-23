import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { type QuotationWithItems } from "@shared/schema";
import { Plus, Trash2, ChevronLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const QUOTATION_TYPES = ["BOS Supply", "EPC", "O&M", "Installation & Commissioning", "Consultation", "Other"];
const STATUS_OPTIONS = ["draft", "sent", "approved", "rejected"];
const UNIT_OPTIONS = ["nos", "Mtrs", "Kgs", "Sets", "Lot", "Sqm", "KWp", "MW"];
const GST_RATES = [0, 5, 12, 18, 28];

type ItemForm = {
  itemName: string;
  qty: number;
  unit: string;
  rate: number;
  discountPercent: number;
  gstPercent: number;
  sortOrder: number;
};

type FormValues = {
  type: string;
  customerName: string;
  createdDate: string;
  validUntil: string;
  status: string;
  notes: string;
  items: ItemForm[];
};

function today() {
  return new Date().toISOString().split("T")[0];
}
function addMonths(date: string, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}
function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

function calcItemAmount(item: ItemForm) {
  const gross = (item.qty || 0) * (item.rate || 0);
  const discAmt = gross * ((item.discountPercent || 0) / 100);
  return gross - discAmt;
}
function calcItemGST(item: ItemForm) {
  return calcItemAmount(item) * ((item.gstPercent || 0) / 100);
}

export default function QuotationForm({ isEdit = false }: { isEdit?: boolean }) {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: existing } = useQuery<QuotationWithItems>({
    queryKey: [`/api/quotations/${params.id}`],
    enabled: isEdit && !!params.id,
  });

  const defaultItem: ItemForm = {
    itemName: "", qty: 1, unit: "nos", rate: 0, discountPercent: 0, gstPercent: 18, sortOrder: 0,
  };

  const form = useForm<FormValues>({
    defaultValues: {
      type: "BOS Supply",
      customerName: "",
      createdDate: today(),
      validUntil: addMonths(today(), 1),
      status: "draft",
      notes: "",
      items: [{ ...defaultItem }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
  const watchedItems = form.watch("items");

  useEffect(() => {
    if (existing && isEdit) {
      form.reset({
        type: existing.type,
        customerName: existing.customerName,
        createdDate: existing.createdDate,
        validUntil: existing.validUntil,
        status: existing.status,
        notes: existing.notes || "",
        items: existing.items.map((it) => ({
          itemName: it.itemName,
          qty: it.qty,
          unit: it.unit,
          rate: it.rate,
          discountPercent: it.discountPercent,
          gstPercent: it.gstPercent,
          sortOrder: it.sortOrder,
        })),
      });
    }
  }, [existing, isEdit]);

  const subtotal = watchedItems.reduce((s, it) => s + calcItemAmount(it), 0);
  const totalGST = watchedItems.reduce((s, it) => s + calcItemGST(it), 0);
  const totalDiscount = watchedItems.reduce((s, it) => {
    const gross = (it.qty || 0) * (it.rate || 0);
    return s + gross * ((it.discountPercent || 0) / 100);
  }, 0);
  const grandTotal = subtotal + totalGST;

  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, items: data.items.map((it, i) => ({ ...it, sortOrder: i })) }),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
      toast({ title: "Quotation created successfully" });
      navigate(`/quotations/${data.id}`);
    },
    onError: () => toast({ title: "Failed to create quotation", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch(`/api/quotations/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, items: data.items.map((it, i) => ({ ...it, sortOrder: i })) }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotations"] });
      queryClient.invalidateQueries({ queryKey: [`/api/quotations/${params.id}`] });
      toast({ title: "Quotation updated successfully" });
      navigate(`/quotations/${data.id}`);
    },
    onError: () => toast({ title: "Failed to update quotation", variant: "destructive" }),
  });

  const onSubmit = (data: FormValues) => {
    if (isEdit) updateMutation.mutate(data);
    else createMutation.mutate(data);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 gap-1"
            onClick={() => navigate(isEdit ? `/quotations/${params.id}` : "/quotations")}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
            <h1 className="text-base font-semibold text-gray-900">
              {isEdit ? `Edit Quotation — ${existing?.number || ""}` : "New Quotation"}
            </h1>
          </div>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isPending}
          data-testid="button-save-quotation"
        >
          <Save className="w-4 h-4" /> {isPending ? "Saving…" : "Save Quotation"}
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Type</Label>
            <Select value={form.watch("type")} onValueChange={(v) => form.setValue("type", v)}>
              <SelectTrigger data-testid="select-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {QUOTATION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Customer Name</Label>
            <Input {...form.register("customerName")} placeholder="Customer / Company name" data-testid="input-customer-name" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</Label>
            <Select value={form.watch("status")} onValueChange={(v) => form.setValue("status", v)}>
              <SelectTrigger data-testid="select-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Created Date</Label>
            <Input type="date" {...form.register("createdDate")} data-testid="input-created-date" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Valid Until</Label>
            <Input type="date" {...form.register("validUntil")} data-testid="input-valid-until" />
          </div>
          <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Notes (optional)</Label>
            <Textarea {...form.register("notes")} placeholder="Terms, remarks…" className="resize-none h-10" data-testid="input-notes" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Line Items</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-green-700 border-green-200 hover:bg-green-50"
              onClick={() => append({ ...defaultItem, sortOrder: fields.length })}
              data-testid="button-add-item"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs w-8">#</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs min-w-[220px]">Item Description</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs w-20">Qty</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs w-24">Unit</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs w-32">Rate (₹)</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs w-24">Disc%</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs w-24">GST%</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-gray-500 text-xs w-36">Amount (₹)</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fields.map((field, idx) => {
                  const item = watchedItems[idx] || {};
                  const amount = calcItemAmount(item as ItemForm);
                  return (
                    <tr key={field.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-2">
                        <Input
                          {...form.register(`items.${idx}.itemName`)}
                          placeholder="Item name / description"
                          className="h-8 text-sm"
                          data-testid={`input-item-name-${idx}`}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          {...form.register(`items.${idx}.qty`, { valueAsNumber: true })}
                          className="h-8 text-sm w-20"
                          data-testid={`input-qty-${idx}`}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={form.watch(`items.${idx}.unit`)}
                          onValueChange={(v) => form.setValue(`items.${idx}.unit`, v)}
                        >
                          <SelectTrigger className="h-8 text-sm w-24"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {UNIT_OPTIONS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          {...form.register(`items.${idx}.rate`, { valueAsNumber: true })}
                          className="h-8 text-sm w-32"
                          data-testid={`input-rate-${idx}`}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          {...form.register(`items.${idx}.discountPercent`, { valueAsNumber: true })}
                          className="h-8 text-sm w-24"
                          data-testid={`input-discount-${idx}`}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={String(form.watch(`items.${idx}.gstPercent`))}
                          onValueChange={(v) => form.setValue(`items.${idx}.gstPercent`, Number(v))}
                        >
                          <SelectTrigger className="h-8 text-sm w-20"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {GST_RATES.map((r) => <SelectItem key={r} value={String(r)}>{r}%</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-gray-800 text-sm tabular-nums">
                        {formatINR(amount)}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-gray-300 hover:text-red-500"
                            onClick={() => remove(idx)}
                            data-testid={`button-remove-item-${idx}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium">₹{formatINR(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="tabular-nums text-red-600">−₹{formatINR(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>GST</span>
                <span className="tabular-nums font-medium">₹{formatINR(totalGST)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-semibold text-base border-t border-gray-200 pt-2">
                <span>Total</span>
                <span className="tabular-nums">₹{formatINR(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
