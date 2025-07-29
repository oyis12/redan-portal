import React, { useState } from 'react';
import { Table } from 'antd';

import check from "../../assets/images/icons/check.png";
import no_data from "../../assets/images/icons/no_data.png";


const dataSource = [
  {
    key: 0,
    user: "Edward King 0",
    status: "Active",
    phone_number: "555-1234-0",
    isVerified: "Verified Phone number",
  },
  {
    key: 1,
    user: "Edward King 1",
    status: "Offline",
    phone_number: "555-1234-1",
    isVerified: "Unverified Phone number",
  },
  {
    key: 2,
    user: "Edward King 2",
    status: "Active",
    phone_number: "555-1234-2",
    isVerified: "Verified Phone number",
  },
  {
    key: 3,
    user: "Edward King 3",
    status: "Offline",
    phone_number: "555-1234-3",
    isVerified: "Verified Phone number",
  },
  {
    key: 4,
    user: "Edward King 4",
    status: "Active",
    phone_number: "555-1234-4",
    isVerified: "Verified Phone number",
  },
  {
    key: 5,
    user: "Edward King 5",
    status: "Offline",
    phone_number: "555-1234-5",
    isVerified: "Unverified Phone number",
  },
  {
    key: 6,
    user: "Edward King 6",
    status: "Active",
    phone_number: "555-1234-6",
    isVerified: "Verified Phone number",
  },
];

const columns = [
  {
    title: "SN",
    key: "sn",
    render: (text, record, index) => index + 1,
    width: 50,
  },
  {
    title: `All Users`,
    dataIndex: "user",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (status) => {
      const isActive = status === "Active";
      const className = isActive
      ? "bg-black text-white px-3 rounded-full"
      : "px-3 border rounded-full";
      return <span className={className}>{status}</span>;
    },
  },
  {
    title: "Phone Number",
    dataIndex: "phone_number",
  },
  {
    title: {},
    dataIndex: "isVerified",
    render: (isVerified) => (
      <span className="flex items-center">
        <img
          src={isVerified === "Unverified Phone number" ? no_data : check}
          alt={isVerified}
          style={{ width: 18, height: 18, marginRight: 8 }}
        />
        {isVerified}
      </span>
    ),
  },
 
];

const AllUsers = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className='mt-5'>
        <Table
        rowSelection={rowSelection}
        columns={columns}
        size='small'
        dataSource={dataSource}
        pagination={{
          borderRadius: '50%',
          position: ['bottomCenter'], // Center the pagination controls
          style: { borderRadius: '50%' }, // Apply rounded borders
        }}
      />
    </div>
  )
}

export default AllUsers