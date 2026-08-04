using Microsoft.EntityFrameworkCore;
using notification_service.Models;

namespace notification_service.Data
{
    /*
     * Class Name: AppDbContext
     * Purpose: Acts as a bridge between our C# application and the MySQL Database.
     * Inherits from DbContext which is provided by Entity Framework Core.
     */
    public class AppDbContext : DbContext
    {
        // Constructor that accepts database options (like connection strings)
        // and passes them to the base DbContext class.
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSet represents a table in our database.
        // This will create a 'NotificationLogs' table in MySQL.
        public DbSet<NotificationLog> NotificationLogs { get; set; }
    }
}
