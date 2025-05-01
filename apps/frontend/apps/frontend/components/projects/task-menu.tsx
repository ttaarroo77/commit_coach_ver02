import { MoreHorizontal } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";

interface TaskMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskMenu({ onEdit, onDelete }: TaskMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-background rounded-md p-2 shadow-md">
          <DropdownMenu.Item
            className="flex items-center px-2 py-1 text-sm hover:bg-accent rounded cursor-pointer"
            onClick={onEdit}
          >
            編集
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center px-2 py-1 text-sm hover:bg-accent rounded cursor-pointer text-destructive"
            onClick={onDelete}
          >
            削除
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
} 