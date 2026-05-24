using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniERP.Server.Data;
using MiniERP.Server.DTOs;
using MiniERP.Server.Models;

namespace MiniERP.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase {
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context) {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get() { 
        var products = _context.Products.ToList();
        var dtos = products.Select(p => new ProductDTO
        {
            Id = p.Id,
            Size = p.Size,
            Brand = p.Brand,
            Pattern = p.Pattern,
            Si = p.Si,
            Li = p.Li,
            NetPrice = p.NetPrice,
            Stock = p.Stock
        }).ToList();
        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id) {
        var product = _context.Products
            .Include(p => p.OrderItems)
            .FirstOrDefault(p => p.Id == id);

        if (product == null) {
            return NotFound();
        }

        var dto = new ProductDetailDTO
        {
            Id = product.Id,
            Size = product.Size,
            Brand = product.Brand,
            Pattern = product.Pattern,
            Si = product.Si,
            Li = product.Li,
            NetPrice = product.NetPrice,
            Stock = product.Stock,
            OrderItems = product.OrderItems.Select(oi => new OrderItemDTO
            {
                Id = oi.Id,
                OrderId = oi.OrderId,
                ProductId = oi.ProductId,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice
            }).ToList()
        };
        return Ok(dto);
    }

    [HttpPost]
    public IActionResult Post(CreateProductDTO createDto) {
        var product = new Product
        {
            Size = createDto.Size,
            Brand = createDto.Brand,
            Pattern = createDto.Pattern,
            Si = createDto.Si,
            Li = createDto.Li,
            NetPrice = createDto.NetPrice,
            Stock = createDto.Stock
        };

        _context.Products.Add(product);
        _context.SaveChanges();

        var dto = new ProductDTO
        {
            Id = product.Id,
            Size = product.Size,
            Brand = product.Brand,
            Pattern = product.Pattern,
            Si = product.Si,
            Li = product.Li,
            NetPrice = product.NetPrice,
            Stock = product.Stock
        };

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, dto);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, UpdateProductDTO updateDto) {
        var existing = _context.Products.Find(id);
        if (existing == null) {
            return NotFound();
        }

        if (updateDto.Size != null)
            existing.Size = updateDto.Size;
        if (updateDto.Brand != null)
            existing.Brand = updateDto.Brand;
        if (updateDto.Pattern != null)
            existing.Pattern = updateDto.Pattern;
        if (updateDto.Si.HasValue)
            existing.Si = updateDto.Si.Value;
        if (updateDto.Li != null)
            existing.Li = updateDto.Li;
        if (updateDto.NetPrice.HasValue)
            existing.NetPrice = updateDto.NetPrice.Value;
        if (updateDto.Stock.HasValue)
            existing.Stock = updateDto.Stock.Value;

        _context.SaveChanges();

        var dto = new ProductDTO
        {
            Id = existing.Id,
            Size = existing.Size,
            Brand = existing.Brand,
            Pattern = existing.Pattern,
            Si = existing.Si,
            Li = existing.Li,
            NetPrice = existing.NetPrice,
            Stock = existing.Stock
        };

        return Ok(dto);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id) {
        var product = _context.Products.Find(id);
        if (product == null) {
            return NotFound();
        }

        _context.Products.Remove(product);
        _context.SaveChanges();

        return NoContent();
    }
}

