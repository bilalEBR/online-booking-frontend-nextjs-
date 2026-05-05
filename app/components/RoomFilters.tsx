"use client";
import { Search, Filter } from "lucide-react";

interface FilterProps {
  onFilterChange: (filters: any) => void;
}

export default function RoomFilters({ onFilterChange }: FilterProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between mb-8">
      <div className="flex flex-1 min-w-[300px] items-center bg-gray-100 px-4 py-2 rounded-lg gap-2">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by room number or description..." 
          className="bg-transparent border-none focus:outline-none w-full text-gray-700"
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="bg-gray-100 p-2 rounded-lg text-gray-600 focus:outline-none"
            onChange={(e) => onFilterChange({ type: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="SINGLE">Single</option>
            <option value="DOUBLE">Double</option>
            <option value="DELUXE">Deluxe</option>
            <option value="SUITE">Suite</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <span>Max Price:</span>
          <input 
            type="number" 
            placeholder="500" 
            className="bg-gray-100 p-2 rounded-lg w-24 focus:outline-none"
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}