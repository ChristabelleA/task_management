using Microsoft.EntityFrameworkCore;

// DbContext for managing tasks in the task management system
namespace TaskManagementAPI.Models
{
    public class TasksContext : DbContext
    {
        public DbSet<Task> Tasks { get; set; }

        public TasksContext(DbContextOptions<TasksContext> options) : base(options) { }

    }
}
