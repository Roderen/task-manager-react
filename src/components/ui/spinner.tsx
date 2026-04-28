import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon role="status" aria-label="Loading" className={cn("size-12 animate-spin", className)} {...props} />
      </div>
  )
}

export { Spinner }
