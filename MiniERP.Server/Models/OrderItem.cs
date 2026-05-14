namespace MiniERP.Server.Models;

public class OrderItem {
    public int Id { get; set; }

    // FK na Order
    public int OrderId { get; set; }

    // FK na Product
    public int ProductId { get; set; }

    public int Quantity { get; set; }

    // cena v době objednávky
    public double UnitPrice { get; set; }

    // Navigation properties
    public Order Order { get; set; }

    public Products Product { get; set; }
}