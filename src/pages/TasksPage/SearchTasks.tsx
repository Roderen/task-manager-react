import {Search} from "lucide-react";

type SearchTaskProps = {
    value: string
    onChange: (value: string) => void
}

const SearchTask = ({ value, onChange }: SearchTaskProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    return (
        <div className="flex items-center gap-2 border rounded-lg px-4 py-2 mb-6">
            <Search size={16} className="text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Search tasks..."
                className="outline-none w-full text-sm"
            />
        </div>
    )
}

export default SearchTask