using Microsoft.AspNetCore.Mvc;
using MiniERP.Server.Data;
using MiniERP.Server.Models;

namespace MiniERP.Server.Controllers; 
[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase {
    private readonly AppDbContext _context;

    public CustomerController(AppDbContext context) {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get() {
        var customers = _context.Customers.ToList();
        return Ok(customers);
    }
    [HttpPost]
    public IActionResult Post(Customer customer) {
        _context.Customers.Add(customer);
        _context.SaveChanges();
        return Ok(customer);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, Customer customer) {
        var existing = _context.Customers.Find(id);
        if (existing == null) {
            return NotFound();
        }
        existing.Name = customer.Name;
        existing.Street = customer.Street;
        existing.City = customer.City;
        existing.Zip = customer.Zip;
        existing.Email = customer.Email;
        existing.Phone = customer.Phone;

        _context.SaveChanges();
        
        return Ok(existing);

    }

}