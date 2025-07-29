import React, { useContext, useState } from "react";
import axios from "axios";
import { Button, Input } from "antd";

import { Context } from "../../context/Context";

const Cutlist = ({ selectedCategoryId, onCreateCutList }) => {
  const { baseUrl, accessToken } = useContext(Context);
  const [cutType, setCutType] = useState("Door Cut");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [depth, setDepth] = useState("");

  console.log("from create", selectedCategoryId);

  const createCutList = async () => {
    const cutListUrl = `${baseUrl}/task`;

    const cutListData = {
      categoryId: selectedCategoryId,
      cutType,
      height,
      weight,
      depth,
    };

    try {
      const response = await axios.post(cutListUrl, cutListData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Cut list created successfully:", response.data);
    } catch (error) {
      console.log("Error creating cut list:", error);
    }
  };

  return (
    <div>
      <div>
        <h2 className="font-semibold">Cut Type</h2>
        <div className="flex gap-6 mt-1">
          <Button className="rounded-full bg-[#F2C94C] hover:!bg-[#F2C94C] border-none hover:!text-black">
            Door Cut
          </Button>
          <Button className="rounded-full bg-[#fcfcfca4] hover:!bg-[#fcfcfca4] hover:!text-black border-none">
            Door Cut
          </Button>
          <Button className="rounded-full bg-[#fcfcfca4] hover:!bg-[#fcfcfca4] hover:!text-black border-none">
            Door Cut
          </Button>
        </div>
      </div>
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Measuremente</h2>
          <span className="text-[#f2994a]">(2 Long)</span>
        </div>
        <div className="flex gap-6 mt-1">
          <Input
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <Input
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Input
            placeholder="Depth"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-52 border-t-[.1rem]">
        <p className="mt-3">
          <span className="text-[#F2994A] font-semibold text-lg">
            LNG &nbsp;
          </span>
          - Means (Long).
        </p>
        <p>
          <span className="text-[#F2994A] font-semibold text-lg">
            F-E-T&nbsp;
          </span>
          - Means (Long).
        </p>
        <p>
          <span className="text-[#F2994A] font-semibold text-lg">& &nbsp;</span>
          - Means (And).
        </p>
      </div>
    </div>
  );
};

export default Cutlist;
