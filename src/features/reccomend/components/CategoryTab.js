export default function CategoryTab({ selectedCategory, onCategoryChange }) {
    const categories = ['Cast', 'Group', 'Job_Listing'];

    return (
        <div className="flex space-x-4">
            {categories.map((category) => (
                <button
                    key={category}
                    className={`px-4 py-2 rounded ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => onCategoryChange(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}