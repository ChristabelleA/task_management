using System.ComponentModel.DataAnnotations;
using TaskManagementAPI.Enums;

// Task model representing a task in the task management system
// used for validation when creating or updating tasks
namespace TaskManagementAPI.Models
{
    public class Task
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be 3-100 chars")]
        public required string Name { get; set; }
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public Priority Priority { get; set; }
    }
}
