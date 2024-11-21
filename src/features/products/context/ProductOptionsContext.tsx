// import React, { createContext, useCallback, useEffect, useState } from "react";
// import {
//   IProductOptionsVariable,
//   IVariantVariables,
//   ProductOptionsContextProps,
// } from "../types/productInterfaces";
// import { IMedia } from "../../media/types/mediaInterfaces";
// import { Form } from "antd";

// export const ProductOptionsContext = createContext<
//   ProductOptionsContextProps | undefined
// >(undefined);

// export const ProductOptionsProvider: React.FC<{
//   children: React.ReactNode;
// }> = ({ children }) => {
//   const [options, setOptions] = useState<IProductOptionsVariable[]>([]);
//   const [variants, setVariants] = useState<IVariantVariables[]>([]);

//   const [optionForm] = Form.useForm();
//   const [variantForm] = Form.useForm();

//   // Options

//   const addOption = () => {
//     if (options.length < 3) {
//       setOptions([...options, { name: "", values: [""] }]);
//     }
//   };

//   const deleteOption = (index: number) => {
//     const newOptions = options.filter((_, i) => i !== index);
//     setOptions(newOptions);
//   };

//   const updateOption = (index: number, option: IProductOptionsVariable) => {
//     const newOptions = options.map((o, i) => (i === index ? option : o));
//     setOptions(newOptions);
//     console.log(newOptions);
//   };

//   // Variants

//   const generateVariants = useCallback(() => {
//     const newVariants: IVariantVariables[] = [];
//     if (options.length > 0) {
//       const [first, ...rest] = options;
//       const restLength = rest.length;
//       first.values.forEach((value) => {
//         if (restLength > 0) {
//           rest.forEach((option) => {
//             option.values.forEach((v) => {
//               newVariants.push({
//                 media: null,
//                 title: `${value} - ${v}`,
//                 price: 0,
//                 sku: "",
//                 optionValues: [value, v], // Add this line
//               });
//             });
//           });
//         } else {
//           newVariants.push({
//             title: value,
//             price: 0,
//             sku: "",
//             optionValues: [value], // Add this line
//           });
//         }
//       });
//     }
//     setVariants(newVariants);
//   }, [options]);

//   useEffect(() => {
//     generateVariants();
//   }, [options, generateVariants]);

//   const handleSkuChange = (index: number, value: string) => {
//     const newVariants = [...variants];
//     newVariants[index].sku = value;
//     setVariants(newVariants);
//     console.log(newVariants);
//   };

//   const handlePriceChange = (index: number, value: number) => {
//     const newVariants = [...variants];
//     newVariants[index].price = value;
//     setVariants(newVariants);
//   };

//   const handleImageChange = (index: number, value: IMedia) => {
//     const newVariants = [...variants];
//     newVariants[index].media = value;
//     setVariants(newVariants);
//     console.log(newVariants);
//   };

//   return (
//     <ProductOptionsContext.Provider
//       value={{
//         options,
//         optionForm,
//         addOption,
//         deleteOption,
//         updateOption,
//         variants,
//         variantForm,
//         handleSkuChange,
//         handlePriceChange,
//         handleImageChange,
//       }}
//     >
//       {children}
//     </ProductOptionsContext.Provider>
//   );
// };
