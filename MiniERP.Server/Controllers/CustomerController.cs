using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniERP.Server.Data;
using MiniERP.Server.DTOs;
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
        var dtos = customers.Select(c => new CustomerDTO
        {
            Id = c.Id,
            Name = c.Name,
            Street = c.Street,
            City = c.City,
            Zip = c.Zip,
            Email = c.Email,
            Phone = c.Phone
        }).ToList();
        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id) {
        var customer = _context.Customers
            .Include(c => c.Orders)
            .FirstOrDefault(c => c.Id == id);
        
        if (customer == null) {
            return NotFound();
        }

        var dto = new CustomerDetailDTO
        {
            Id = customer.Id,
            Name = customer.Name,
            Street = customer.Street,
            City = customer.City,
            Zip = customer.Zip,
            Email = customer.Email,
            Phone = customer.Phone,
            Orders = customer.Orders.Select(o => new OrderDTO
            {
                Id = o.Id,
                CustomerId = o.CustomerId,
                Shipping = o.Shipping,
                Payment = o.Payment,
                CreatedAt = o.CreatedAt,
                TotalPrice = o.TotalPrice,
                Note = o.Note,
                Status = o.Status
            }).ToList()
        };
        return Ok(dto);
    }

    [HttpPost]
    public IActionResult Post(CreateCustomerDTO createDto) {
        var customer = new Customer
        {
            Name = createDto.Name,
            Street = createDto.Street,
            City = createDto.City,
            Zip = createDto.Zip,
            Email = createDto.Email,
            Phone = createDto.Phone
        };

        _context.Customers.Add(customer);
        _context.SaveChanges();

        var dto = new CustomerDTO
        {
            Id = customer.Id,
            Name = customer.Name,
            Street = customer.Street,
            City = customer.City,
            Zip = customer.Zip,
            Email = customer.Email,
            Phone = customer.Phone
        };

        return CreatedAtAction(nameof(GetById), new { id = customer.Id }, dto);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, UpdateCustomerDTO updateDto) {
        var existing = _context.Customers.Find(id);
        if (existing == null) {
            return NotFound();
        }

        if (!string.IsNullOrEmpty(updateDto.Name))
            existing.Name = updateDto.Name;
        if (!string.IsNullOrEmpty(updateDto.Street))
            existing.Street = updateDto.Street;
        if (!string.IsNullOrEmpty(updateDto.City))
            existing.City = updateDto.City;
        if (!string.IsNullOrEmpty(updateDto.Zip))
            existing.Zip = updateDto.Zip;
        if (!string.IsNullOrEmpty(updateDto.Email))
            existing.Email = updateDto.Email;
        if (!string.IsNullOrEmpty(updateDto.Phone))
            existing.Phone = updateDto.Phone;

        _context.SaveChanges();

        var dto = new CustomerDTO
        {
            Id = existing.Id,
            Name = existing.Name,
            Street = existing.Street,
            City = existing.City,
            Zip = existing.Zip,
            Email = existing.Email,
            Phone = existing.Phone
        };

        return Ok(dto);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id) {
        var customer = _context.Customers.Find(id);
        if (customer == null) {
            return NotFound();
        }

        _context.Customers.Remove(customer);
        _context.SaveChanges();

        return NoContent();
    }

}