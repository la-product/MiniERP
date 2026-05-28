namespace MiniERP.Server.DTOs;

public class OrderDTO
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string? Shipping { get; set; }
    public string? Payment { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public double TotalPrice { get; set; }
    public string? Note { get; set; }
    public string Status { get; set; } = string.Empty;
    public CustomerDTO? Customer { get; set; }
}

public class CreateOrderDTO
{
    public int CustomerId { get; set; }
    public string? Shipping { get; set; }
    public string? Payment { get; set; }
    public double TotalPrice { get; set; }
    public string? Note { get; set; }
    public string Status { get; set; } = "new";
    public List<CreateOrderItemDTO> Items { get; set; } = new();
}

public class UpdateOrderDTO
{
    public string? Shipping { get; set; }
    public string? Payment { get; set; }
    public double? TotalPrice { get; set; }
    public string? Note { get; set; }
    public string? Status { get; set; }
}

public class OrderDetailDTO
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string? Shipping { get; set; }
    public string? Payment { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public double TotalPrice { get; set; }
    public string? Note { get; set; }
    public string Status { get; set; } = string.Empty;
    public CustomerDTO? Customer { get; set; }
    public List<OrderItemDetailDTO> Items { get; set; } = new();
}
