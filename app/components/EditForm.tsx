import React, { useState } from 'react';

type EditFormProps<T> = {
  initialData: T;
  onUpdate: (updatedData: T) => void;
  onCancel: () => void;
};

const EditForm = <T,>({ initialData, onUpdate, onCancel }: EditFormProps<T>) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      {Object.keys(initialData).map((key) => (
        <div key={key} className="mb-2">
          <label className="block text-sm">{key}</label>
          <input
            type="text"
            name={key}
            value={(formData as any)[key]}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Update
      </button>
      <button type="button" onClick={onCancel} className="bg-gray-300 text-black p-2 rounded ml-2">
        Cancel
      </button>
    </form>
  );
};

export default EditForm;
