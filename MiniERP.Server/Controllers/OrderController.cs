using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniERP.Server.Data;
using MiniERP.Server.DTOs;
using MiniERP.Server.Models;

namespace MiniERP.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase {
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context) {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get() {
        var orders = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .ToList();

        var dtos = orders.Select(o => new OrderDTO
        {
            Id = o.Id,
            CustomerId = o.CustomerId,
            Shipping = o.Shipping,
            Payment = o.Payment,
            CreatedAt = o.CreatedAt,
            TotalPrice = o.TotalPrice,
            Note = o.Note,
            Status = o.Status
        }).ToList();

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id) {
        var order = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefault(o => o.Id == id);

        if (order == null) return NotFound();

        var dto = new OrderDetailDTO
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            Shipping = order.Shipping,
            Payment = order.Payment,
            CreatedAt = order.CreatedAt,
            TotalPrice = order.TotalPrice,
            Note = order.Note,
            Status = order.Status,
            Customer = new CustomerDTO
            {
                Id = order.Customer.Id,
                Name = order.Customer.Name,
                Street = order.Customer.Street,
                City = order.Customer.City,
                Zip = order.Customer.Zip,
                Email = order.Customer.Email,
                Phone = order.Customer.Phone
            },
            Items = order.Items.Select(i => new OrderItemDetailDTO
            {
                Id = i.Id,
                OrderId = i.OrderId,
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                Product = new ProductDTO
                {
                    Id = i.Product.Id,
                    Size = i.Product.Size,
                    Brand = i.Product.Brand,
                    Pattern = i.Product.Pattern,
                    Si = i.Product.Si,
                    Li = i.Product.Li,
                    NetPrice = i.Product.NetPrice,
                    Stock = i.Product.Stock
                }
            }).ToList()
        };

        return Ok(dto);
    }

    [HttpPost]
    public IActionResult Post(CreateOrderDTO createDto) {
        var order = new Order
        {
            CustomerId = createDto.CustomerId,
            Shipping = createDto.Shipping,
            Payment = createDto.Payment,
            TotalPrice = createDto.TotalPrice,
            Note = createDto.Note,
            Status = createDto.Status,
            CreatedAt = DateTimeOffset.UtcNow
        };

        // Mapuj items
        foreach (var itemDto in createDto.Items) {
            order.Items.Add(new OrderItem
            {
                ProductId = itemDto.ProductId,
                Quantity = itemDto.Quantity,
                UnitPrice = itemDto.UnitPrice
            });
        }

        _context.Orders.Add(order);

        // Odečti stock v DB
        foreach (var item in order.Items) {
            var product = _context.Products.Find(item.ProductId);
            if (product != null) {
                product.Stock -= item.Quantity;
            }
        }

        _context.SaveChanges();

        var dto = new OrderDTO
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            Shipping = order.Shipping,
            Payment = order.Payment,
            CreatedAt = order.CreatedAt,
            TotalPrice = order.TotalPrice,
            Note = order.Note,
            Status = order.Status
        };

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, dto);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, UpdateOrderDTO updateDto) {
        var order = _context.Orders.Find(id);
        if (order == null) return NotFound();

        if (updateDto.Shipping != null)
            order.Shipping = updateDto.Shipping;
        if (updateDto.Payment != null)
            order.Payment = updateDto.Payment;
        if (updateDto.TotalPrice.HasValue)
            order.TotalPrice = updateDto.TotalPrice.Value;
        if (updateDto.Note != null)
            order.Note = updateDto.Note;
        if (updateDto.Status != null)
            order.Status = updateDto.Status;

        _context.SaveChanges();

        var dto = new OrderDTO
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            Shipping = order.Shipping,
            Payment = order.Payment,
            CreatedAt = order.CreatedAt,
            TotalPrice = order.TotalPrice,
            Note = order.Note,
            Status = order.Status
        };

        return Ok(dto);
    }

    [HttpPut("{id}/status")]
    public IActionResult UpdateStatus(int id, [FromBody] string status) {
        var order = _context.Orders.Find(id);
        if (order == null) return NotFound();

        order.Status = status;
        _context.SaveChanges();

        var dto = new OrderDTO
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            Shipping = order.Shipping,
            Payment = order.Payment,
            CreatedAt = order.CreatedAt,
            TotalPrice = order.TotalPrice,
            Note = order.Note,
            Status = order.Status
        };

        return Ok(dto);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id) {
        var order = _context.Orders
            .Include(o => o.Items)
            .FirstOrDefault(o => o.Id == id);

        if (order == null) return NotFound();

        // Vrátit stock
        foreach (var item in order.Items) {
            var product = _context.Products.Find(item.ProductId);
            if (product != null) {
                product.Stock += item.Quantity;
            }
        }

        _context.Orders.Remove(order);
        _context.SaveChanges();

        return NoContent();
    }
}