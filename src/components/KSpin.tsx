import { Spin } from 'antd';

export const KSpin = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Spin size="large" />
    </div>
  );
};