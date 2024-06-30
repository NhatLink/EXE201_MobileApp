import React from "react";
import { View, Text, RefreshControl } from "react-native";
import { Agenda } from "react-native-calendars"; // Giả sử bạn đang sử dụng thư viện này
import { COLORS } from "../../constants";

const AgendaComponent = ({
  items,
  renderItem,
  renderEmptyData,
  refreshing,
  onRefresh,
}) => {
  return (
    <Agenda
      items={items}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyData}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      theme={{
        agendaTodayColor: COLORS.red, // Thay đổi màu sắc theo nhu cầu của bạn
      }}
    />
  );
};

export default AgendaComponent;
