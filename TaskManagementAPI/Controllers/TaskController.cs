using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementAPI.Models;
using Task = TaskManagementAPI.Models.Task;

// Controller for managing tasks in the task management system
// provides endpoints for CRUD operations on tasks
namespace TaskManagementAPI.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TaskController : ControllerBase
    {
        // private tasks DB context field to reference
        private readonly TasksContext _tasksContext;

        //constructor to initialize the DB context field
        public TaskController(TasksContext tasksContext)
        {
            _tasksContext = tasksContext;
        }


        /*
       * Description: Retrieves all tasks from database
       * Responses: Ok with array of tasks, Internal Server Error
      */
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            try
            {
                return Ok(await _tasksContext.Tasks.ToListAsync());
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        /*
       * Description: Retrieves task by id from database
       * Responses: NotFound, Ok with task information, Internal Server Error
      */
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            try
            {
                var task = await _tasksContext.Tasks.FindAsync(id);
                return task == null ? NotFound() : Ok(task);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        /*
        * Description: Creates and retrieves task from database
        * Responses: Ok with task information, Internal Server Error
       */
        [HttpPost]
        public async Task<IActionResult> CreateTask(Task newTask )
        {
            try
            {
                _tasksContext.Tasks.Add(newTask);
                await _tasksContext.SaveChangesAsync();
                return CreatedAtAction(nameof(GetTask), new { id = newTask.Id }, newTask);
            }
            catch(Exception)
            {
                return StatusCode(500);
            }
        }


        /*
         * Description: Validates task exists and updates and retrieves task from database
         * Responses: Not Found, Ok with task information, Internal Server Error
        */
        [HttpPut]
        public async Task<IActionResult> UpdateTask(Task updatedTask)
        {
            try
            {

                _tasksContext.Tasks.Update(updatedTask);
                await _tasksContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTask), new { id = updatedTask.Id }, updatedTask);
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }
            catch (Exception e)
            {
                return StatusCode(500);
            }
        }

        /*
         * Description: Validates task exists and deletes from database
         * Responses: Not Found, No Content, Internal Server Error
        */
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            try
            {
                var task = await _tasksContext.Tasks.FindAsync(id);
                if (task == null) return NotFound();
                _tasksContext.Tasks.Remove(task);
                await _tasksContext.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }


    }
}
