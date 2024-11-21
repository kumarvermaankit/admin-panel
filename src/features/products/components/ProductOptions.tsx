// import { Button, Card, Divider } from "antd";
// import { PlusCircleOutlined } from "@ant-design/icons";
// import { ProductOption } from "./ProductOption";
// import { useProductOptions } from "../context/useProductOptions";
// import Title from "antd/es/typography/Title";
// import { ProductVariants } from "./ProductVariants";



// export const ProductOptions = () => {
//   const { options, addOption } = useProductOptions();

//   return (
//     <>
//       <Title level={5}>Variants</Title>
//       {options.length > 0 ? (
//         <Card style={{ borderColor: "#d9d9d9", marginBottom: "20px" }}>
//           {options.map((option, index) => (
//             <div key={index}>
//               <ProductOption index={index} option={option} />
//               {options.length > 0 && (
//                 <Divider style={{ borderColor: "#d9d9d9" }} />
//               )}
//             </div>
//           ))}
//           {options.length < 3 && (
//             <Button
//               type="link"
//               icon={<PlusCircleOutlined />}
//               onClick={addOption}
//             >
//               Add another option
//             </Button>
//           )}
//         </Card>
//       ) : (
//         <Button type="link" icon={<PlusCircleOutlined />} onClick={addOption}>
//           Add options like size or color
//         </Button>
//       )}
//       {options.length > 0 && <ProductVariants />}
//     </>
//   );
// };
