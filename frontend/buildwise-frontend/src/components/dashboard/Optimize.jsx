// // Optimization.jsx
// import React, { useEffect, useState } from 'react';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { db } from '../../firebase';
// import { collection, getDoc, doc } from 'firebase/firestore';

// // Access the API key from environment variables
// const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// const Optimization = ({ projectId }) => {
//   const [originalMaterials, setOriginalMaterials] = useState([]);
//   const [optimizedMaterials, setOptimizedMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const genAI = new GoogleGenerativeAI(API_KEY);

//   useEffect(() => {
//     const fetchMaterials = async () => {
//       try {
//         const docRef = doc(db, 'projects', projectId);
//         const projectSnap = await getDoc(docRef);

//         if (projectSnap.exists()) {
//           const materials = projectSnap.data().materials || [];
//           setOriginalMaterials(materials);
//           getOptimizedMaterials(materials);
//         }
//       } catch (err) {
//         console.error('Error fetching project:', err);
//       }
//     };

//     const getOptimizedMaterials = async (materials) => {
//       // If no API key is available, show an error
//       if (!API_KEY) {
//         console.error("Gemini API key not found in environment variables");
//         setLoading(false);
//         return;
//       }
      
//       const prompt = `
// Suggest cheaper and eco-friendly alternatives for the following construction materials.
// For each item, provide:
// 1. Alternative Material Name
// 2. Estimated Cost Per Unit
// 3. Reason for Suggestion (brief)

// Materials:
// ${materials.map(mat => 
//   `Name: ${mat.name}, Quantity: ${mat.quantity} ${mat.unit}, Cost Per Unit: ${mat.costPerUnit}`
// ).join('\n')}
// `;

//       try {
//         const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
//         const result = await model.generateContent(prompt);
//         const text = result.response.text();

//         // Basic parsing logic (you can customize this based on response format)
//         const parsed = text.split('\n').filter(line => line.includes(':'));
//         const formatted = [];

//         let currentMaterial = {};
//         parsed.forEach(line => {
//           if (line.toLowerCase().includes("alternative material")) {
//             if (Object.keys(currentMaterial).length > 0) {
//               formatted.push(currentMaterial);
//               currentMaterial = {};
//             }
//             currentMaterial.name = line.split(':')[1].trim();
//           } else if (line.toLowerCase().includes("estimated cost")) {
//             currentMaterial.cost = line.split(':')[1].trim();
//           } else if (line.toLowerCase().includes("reason")) {
//             currentMaterial.reason = line.split(':')[1].trim();
//           }
//         });
//         if (Object.keys(currentMaterial).length > 0) {
//           formatted.push(currentMaterial);
//         }

//         setOptimizedMaterials(formatted);
//       } catch (error) {
//         console.error("Error generating content:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMaterials();
//   }, [projectId]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Optimization for Project: {projectId}</h1>
//       {!API_KEY && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
//           <p>Gemini API key is not configured. Please add it to your environment variables.</p>
//         </div>
//       )}
//       {loading ? (
//         <p>Fetching optimized materials...</p>
//       ) : (
//         <div className="grid grid-cols-2 gap-6">
//           {/* Original Materials */}
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Original Materials</h2>
//             <ul>
//               {originalMaterials.map((mat, idx) => (
//                 <li key={idx} className="p-3 bg-gray-100 rounded mb-3 shadow">
//                   <strong>{mat.name}</strong> <br />
//                   Quantity: {mat.quantity} {mat.unit} <br />
//                   Cost Per Unit: ₹{mat.costPerUnit} <br />
//                   Total Cost: ₹{mat.materialsCost || (mat.quantity * mat.costPerUnit)}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Optimized Materials */}
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Optimized Alternatives</h2>
//             <ul>
//               {optimizedMaterials.map((opt, idx) => (
//                 <li key={idx} className="p-3 bg-green-100 rounded mb-3 shadow">
//                   <strong>Alternative:</strong> {opt.name} <br />
//                   <strong>Estimated Cost/Unit:</strong> {opt.cost} <br />
//                   <strong>Reason:</strong> {opt.reason}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Optimization;