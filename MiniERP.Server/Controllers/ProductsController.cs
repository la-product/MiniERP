using Microsoft.AspNetCore.Mvc;
using MiniERP.Server.Data;
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
        return Ok(products);
    }
    [HttpPost]
    public IActionResult Post(Products product) {
        _context.Products.Add(product);
        _context.SaveChanges();
        return Ok(product);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, Products products) {
        var existing = _context.Products.Find(id);
        if (existing == null) {
            return NotFound();
        }
        existing.Size = products.Size;
        existing.Brand = products.Brand;
        existing.Pattern = products.Pattern;
        existing.Si = products.Si;
        existing.Li = products.Li;
        existing.NetPrice = products.NetPrice;
        existing.Stock = products.Stock;

        _context.SaveChanges();

        return Ok(existing);

    }




}
