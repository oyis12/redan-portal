import React from "react";
import { Modal, Checkbox, Select, Button } from "antd";

const { Option } = Select;

const NotificationSection = ({
  title,
  description,
  options,
  onChange,
  selectOptions,
  onSelectChange,
}) => (
  <div className="mt-3">
    <h2 className="font-bold">{title}</h2>
    <p className="text-sm font-semibold">{description}</p>
    {selectOptions && (
      <Select
        className="mt-3"
        defaultValue={selectOptions[0]}
        onChange={onSelectChange}
      >
        {selectOptions.map((option, index) => (
          <Option key={index} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    )}
    <div className="mt-3 flex flex-col">
      {options.map((option, index) => (
        <Checkbox key={index} onChange={onChange}>
          {option}
        </Checkbox>
      ))}
    </div>
  </div>
);

const Notification = ({
  open,
  handleCancel,
  modalTitle,
  modalText,
  sections,
  handleSendClick,
  confirmLoading,
  isAnyChecked,
  handleCheckboxChange,
  handleSelectChange,
}) => {
  return (
    <Modal
      title=""
      width={400}
      height= "100vh"
      open={open}
      onCancel={handleCancel}
      footer={[
        <div
          className="flex items-center justify-between w-60 float-right"
          key="footer"
        >
          <Button
            key="cancel"
            className="flex items-center rounded-full text-[#B0B2C3] px-6 h-9 font-semibold border"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className={`flex items-center rounded-full px-6 h-9 font-semibold border bg-transparent border-none  ${
              isAnyChecked ? "bg-[#F1B31C]" : "text-[#F1B31C]"
            }`}
            key="send"
            type="primary"
            loading={confirmLoading}
            onClick={handleSendClick}
          >
            Send
          </Button>
        </div>,
      ]}
      className="custom-modal"
      getContainer={false}
    >
      <h2 className="font-semibold text-2xl">{modalTitle}</h2>
      <p>{modalText}</p>

      {sections.map((section, index) => (
        <NotificationSection
          key={index}
          title={section.title}
          description={section.description}
          options={section.options}
          selectOptions={section.selectOptions}
          onChange={handleCheckboxChange}
          onSelectChange={handleSelectChange}
        />
      ))}
    </Modal>
  );
};

export default Notification;
