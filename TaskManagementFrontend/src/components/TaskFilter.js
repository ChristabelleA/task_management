import { Checkbox, FormControlLabel, FormControl, RadioGroup, Radio } from "@mui/material";
import { useTasks, useTasksActions } from "../context/TasksContext";
import { useState } from "react";

export default function TaskFilter() {
  const { filters, priority } = useTasks();
  const { setPriorityFilter, setCompletedFilter } = useTasksActions();
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="filter  border mb-4 p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filters</h5>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowFilters((prev) => !prev)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="row gy-3">
          {/* Show Priority */}
          <div className="col-12 col-md-6 d-flex flex-column gap-2">
            <label className="fw-bold">Show Priority</label>
            <div className="d-flex flex-wrap gap-2">
              {priority &&
                Object.entries(priority).map(([key, label]) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        value={key}
                        checked={filters.priorityStatus.includes(Number(key))}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          let newPriorityStatus = [...filters.priorityStatus];
                          if (e.target.checked) {
                            newPriorityStatus.push(value);
                          } else {
                            newPriorityStatus = newPriorityStatus.filter((item) => item !== value);
                          }
                          setPriorityFilter(newPriorityStatus);
                        }}
                      />
                    }
                    label={label}
                  />
                ))}
            </div>
          </div>

          {/* Show Completed */}
          <div className="col-12 col-md-6 d-flex flex-column gap-2">
            <label className="fw-bold">Show Completed</label>
            <FormControl>
              <RadioGroup row aria-labelledby="completed-filter" value={filters.completedStatus} onChange={(e) => setCompletedFilter(e.target.value)}>
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="completed" control={<Radio />} label="Completed" />
                <FormControlLabel value="incompleted" control={<Radio />} label="Incompleted" />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      )}
    </div>
  );
}
