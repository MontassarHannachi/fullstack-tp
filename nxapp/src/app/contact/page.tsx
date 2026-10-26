"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // empêche le rechargement de la page
    console.log("Form submitted:", formData);
  }

  const emailInvalid = formData.email !== "" && !/^\S+@\S+\.\S+$/.test(formData.email);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
      <input
        className="border p-2"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        className="border p-2"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      {emailInvalid && <small className="text-red-600">A valid email is required</small>}
      <button type="submit" disabled={!formData.name || !formData.email || emailInvalid}>
        Submit
      </button>
    </form>
  );
}
