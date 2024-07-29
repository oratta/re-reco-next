export default function CategoryTab({ selectedCategory, onCategoryChange }) {
    return (
        <div className="flex space-x-4">
            <button
                className={`px-4 py-2 rounded ${selectedCategory === 'Group' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => onCategoryChange('Group')}
            >
                Group
            </button>
            <button
                className={`px-4 py-2 rounded ${selectedCategory === 'Cast' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => onCategoryChange('Cast')}
            >
                Cast
            </button>
        </div>
    );
}