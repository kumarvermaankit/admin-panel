// import { IProductOptionsVariable } from "../types/productInterfaces";
// import {
//   Button,
//   Card,
//   Col,
//   Form,
//   Input,
//   Row,
//   Tag,
//   Typography,
// } from "antd";
// import { useProductOptions } from "../context/useProductOptions";
// import { DeleteOutlined } from "@ant-design/icons";
// import React, { useState } from "react";
// const { Text } = Typography;

// interface IProductOptionProps {
//   index: number;
//   option: IProductOptionsVariable;
// }

// export const ProductOption = ({ index, option }: IProductOptionProps) => {
//   const { optionForm, deleteOption, updateOption } = useProductOptions();
//   const [duplicateValue, setDuplicateValue] = useState<string | null>(null);

//   const [isOptionDone, setIsOptionDone] = useState<boolean>(false);

//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     updateOption(index, { name: e.target.value, values: option.values });
//   };

//   const handleValueChange = (i: number, value: string) => {
//     const newValues = option.values.map((v, j) => (i === j ? value : v));

//     // Check for duplicates
//     const duplicatesValue = findDuplicates(newValues);
//     setDuplicateValue(duplicatesValue);

//     updateOption(index, { name: option.name, values: newValues });
//   };

//   const handleAddValue = (value: string) => {
//     const newValues = [...option.values, value];
//     updateOption(index, { name: option.name, values: newValues });
//   };

//   const handleDeleteValue = (i: number) => {
//     const newValues = option.values.filter((_, j) => i !== j);
//     updateOption(index, { name: option.name, values: newValues });
//     optionForm.resetFields([`options[${index}].values[${i}]`]);
//   };

//   const findDuplicates = (values: string[]) => {
//     const duplicates = values.filter(
//       (value, index) => values.indexOf(value) !== index
//     );
//     if (duplicates.length > 0 && duplicates[0] !== "") {
//       return `You've already used the option value "${duplicates.join(", ")}"`;
//     } else {
//       return "";
//     }
//   };

//   const handleDone = async () => {
//     try {
//       // Validate specific fields
//       await optionForm.validateFields([
//         `options[${index}].name`,
//         ...option.values.map((_, i) => `options[${index}].values[${i}]`),
//       ]);
//       console.log("Validation passed");
//       setIsOptionDone(true);
//     } catch (errorInfo) {
//       console.log("Validation failed:", errorInfo);
//     }
//   };

//   return (
//     <div>
//       {isOptionDone ? (
//         <Card size="small" onClick={() => setIsOptionDone(false)}>
//           <Row style={{ marginBottom: "10px" }}>
//             <Text style={{ fontWeight: 500 }}>{option.name}</Text>
//           </Row>
//           <Row>
//             {option.values.map((value, i) => (
//               <Tag key={i}>{value}</Tag>
//             ))}
//           </Row>
//         </Card>
//       ) : (
//         <Form form={optionForm} component={false}>
//           <Form.Item
//             label="Option name"
//             name={`options[${index}].name`}
//             rules={[{ required: true, message: "Option name is required" }]}
//             style={{ marginBottom: "12px" }}
//           >
//             <Input
//               type="text"
//               style={{ borderColor: "#b5b5b5" }}
//               value={option.name}
//               onChange={handleNameChange}
//             />
//           </Form.Item>

//           <Form.Item
//             label="Option values"
//             name={`options[${index}].values`}
//             style={{ marginBottom: "12px" }}
//           >
//             <div>
//               {option.values.map((value, i) => (
//                 <Form.Item
//                   name={`options[${index}].values[${i}]`}
//                   key={i}
//                   rules={[
//                     { required: true, message: "Option value is required" },
//                   ]}
//                   style={{ marginBottom: "8px" }}
//                 >
//                   <Input
//                     type="text"
//                     style={{ borderColor: "#b5b5b5" }}
//                     value={value}
//                     autoFocus={
//                       i === option.values.length - 1 && option.values.length > 1
//                     }
//                     suffix={
//                       <DeleteOutlined onClick={() => handleDeleteValue(i)} />
//                     }
//                     onChange={(e) => handleValueChange(i, e.target.value)}
//                     onPressEnter={
//                       i === option.values.length - 1
//                         ? () => handleAddValue("")
//                         : undefined
//                     }
//                   />
//                 </Form.Item>
//               ))}
//               <Button
//                 style={{ width: "100%" }}
//                 size="small"
//                 type="dashed"
//                 onClick={() => handleAddValue("")}
//               >
//                 Add Value
//               </Button>
//               {duplicateValue && <Text type="danger">{duplicateValue}</Text>}
//             </div>
//           </Form.Item>
//           <Row justify="space-between" style={{ marginTop: "8px" }}>
//             <Col>
//               <Button
//                 size="small"
//                 danger
//                 onClick={() => {
//                   deleteOption(index);
//                   optionForm.resetFields([`options[${index}].name`]);
//                   optionForm.resetFields(
//                     option.values.map(
//                       (_, i) => `options[${index}].values[${i}]`
//                     )
//                   );
//                 }}
//               >
//                 Delete
//               </Button>
//             </Col>
//             <Col>
//               <Button size="small" type="primary" onClick={handleDone}>
//                 Done
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       )}
//     </div>
//   );
// };
