import { AsanaTask } from "@/types/lib";

export const calculateTotalStoryPoint = (tasks: AsanaTask[]): number => {
  const totalStoryPoint = tasks.reduce((total, task) => {
    if (!task.custom_fields) return total;
    
    const storyPointField = task.custom_fields.find(
      (field) => field.name === "Story Point"
    );
    
    if (storyPointField?.number_value) {
      return total + storyPointField.number_value;
    }
    
    return total;
  }, 0);

  return Math.round(totalStoryPoint * 100) / 100;
};
