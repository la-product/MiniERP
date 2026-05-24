namespace MiniERP.Server.Models; 
public class Invoice {

    public int Id { get; set; }

    public DateOnly IssueDate { get; set; }

    public DateOnly DueDate { get; set; }

    public string Status { get; set; } = string.Empty;

    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    public decimal TotalAmountExVat { get; set; }

    public decimal VatAmount {  get; set; }
    public decimal TotalAmountIncVat { get; set; }
    public string CurrencyCode { get; set; } = string.Empty;
    public ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();

}
