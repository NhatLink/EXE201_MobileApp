import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const AboutOur = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* <Loader visible={loading} /> */}
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}> Về chúng tôi</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>Hairhub - Đặt lịch mọi lúc, phục vụ mọi nơi</Text>
        <Text style={styles.text}>
        - Hairhub là một dự án được xây dựng và phát triển bởi một nhóm sinh viên trường Đại học FPT với mong muốn mang lại một nền tảng đặt lịch cắt tóc trực tuyến hàng đầu Việt Nam giúp khách hàng và các salon, barber shop kết nối dễ dàng với nhau một cách chuyên nghiệp và tiện ích.{"\n"}
        - Ra đời trong thời điểm ngành công nghiệp làm đẹp và dịch vụ trực tuyến ngày càng phát triển mạnh mẽ, Hairhub tự hào là một trong những đơn vị tiên phong trong lĩnh vực đặt lịch cắt tóc trực tuyến tại Việt Nam. Với sự gia tăng nhu cầu về trải nghiệm dịch vụ tiện ích và chất lượng, chúng tôi đã nỗ lực không ngừng để mang đến cho khách hàng một giải pháp đặt lịch cắt tóc đơn giản, nhanh chóng và hiệu quả.
        </Text>
        <Text style={styles.header}>Tầm Nhìn Của Chúng Tôi</Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>
            - Tại Hairhub, chúng tôi hướng tới việc tạo ra một trải nghiệm dịch vụ làm đẹp vừa thoải mái vừa tiện lợi cho mọi khách hàng.{" "}
          </Text>
          Tầm nhìn của chúng tôi là trở thành nền tảng hàng đầu trong việc cung cấp giải pháp đặt lịch cắt tóc và dịch vụ làm đẹp trực tuyến, nơi bạn có thể dễ dàng lựa chọn và lên lịch cho các dịch vụ làm đẹp ở các tiệm tóc bất cứ khi nào và ở bất cứ đâu mà không phải mất nhiều thời gian chờ đợi.{"\n"}
          <Text style={styles.boldText}>
            - Chúng tôi cam kết nâng cao cả số lượng và chất lượng khách hàng cho các tiệm tóc vừa và nhỏ,{" "}
          </Text>
          giúp họ mở rộng và phát triển mạnh mẽ hơn trong thị trường cạnh tranh. Hairhub không chỉ là cầu nối giữa khách hàng và các nhà tạo mẫu tóc, mà còn là nền tảng để kết nối, chia sẻ và gợi ý về các kiểu tóc, từ đó mang đến cho khách hàng những lựa chọn phù hợp nhất với phong cách và nhu cầu của họ.{"\n"}
          <Text style={styles.boldText}>
            - Chúng tôi mong muốn tạo ra một trải nghiệm thư giãn và tích cực cho tất cả người dùng của mình,{" "}
          </Text>
           từ việc lên lịch cắt tóc và tận hưởng dịch vụ tại tiệm tóc cho đến việc quản lý các lịch hẹn, doanh thu, ... cho các tiệm tóc. Với Hairhub, chúng tôi tin rằng việc đặt lịch hẹn bằng Hairhub không chỉ là một hành động cứng ngắt và nhàm chán, mà là một khoảnh khắc thú vị và đáng nhớ.
          
        </Text>

        <Text style={styles.header}>Sứ Mệnh Của Hairhub</Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>
            - Xây Dựng Một Nền Tảng An Toàn và Chất Lượng:{" "}
          </Text>
          Chúng tôi cam kết tạo ra một nền tảng kết nối đáng tin cậy giữa khách hàng và các salon, barber shop. Hairhub đảm bảo rằng các đối tác của chúng tôi đều đạt tiêu chuẩn cao về an toàn và chất lượng, mang đến cho khách hàng những dịch vụ làm đẹp tốt nhất và salon, barber shop những môi trường phát triển tuyệt vời nhất.{"\n"}
          <Text style={styles.boldText}>
            - Tạo Ra Cộng Đồng Làm Đẹp Tích Cực:{" "}
          </Text>
          Chúng tôi nỗ lực xây dựng một cộng đồng làm đẹp nơi mà các salon, barber shop và khách hàng có thể kết nối và chia sẻ. Hairhub không chỉ là nơi để đặt lịch, mà còn là không gian để tạo ra những mối quan hệ tích cực và ý nghĩa trong ngành làm đẹp.{"\n"}
          <Text style={styles.boldText}>
            - Cung Cấp Trải Nghiệm Thoải Mái và Thú Vị:{" "}
          </Text>
           Chúng tôi hiểu rằng việc làm đẹp không chỉ là nhu cầu mà còn là cơ hội để thư giãn và làm mới tinh thần. Hairhub mang đến những trải nghiệm làm đẹp dễ dàng và vui vẻ cùng với việc quản lý lịch hẹn, khách hàng và doanh thu giúp bạn cảm thấy thoải mái và xua tan căng thẳng.{"\n"}
          <Text style={styles.boldText}>
            - Đồng Hành Cùng Bạn Trong Mỗi Bước Đường Làm Đẹp:{" "}
          </Text>
          Chúng tôi là người bạn đồng hành đáng tin cậy trong hành trình làm đẹp của bạn. Dù bạn đang tìm kiếm sự thay đổi phong cách hay chỉ đơn giản là chăm sóc bản thân, Hairhub luôn sẵn sàng hỗ trợ và cung cấp các giải pháp phù hợp nhất.
          
        </Text>

        <Text style={styles.header}>
        Lợi ích của khách hàng đặt lịch khi sử dụng Hairhub
        </Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>
            - Tiện lợi và dễ dàng:{" "}
          </Text>
          Khách hàng có thể đặt lịch hẹn trực tuyến mọi lúc, mọi nơi thông qua nền tảng Hairhub mà không cần phải gọi điện hoặc đến trực tiếp salon hay barber shop.{"\n"}
          <Text style={styles.boldText}>
            - Xem lịch trình và dịch vụ:{" "}
          </Text>
          Hairhub cho phép khách hàng xem lịch trình của các salon và barber shop, cùng với thông tin chi tiết về dịch vụ và giá cả, giúp dễ dàng chọn lựa dịch vụ phù hợp.{"\n"}
          <Text style={styles.boldText}>
            - Nhận thông báo nhắc nhở:{" "}
          </Text>
           Khách hàng nhận được thông báo nhắc nhở qua email hoặc tin nhắn về lịch hẹn sắp tới, giúp họ không bỏ lỡ lịch hẹn và giảm thiểu việc quên hẹn.{"\n"}
          <Text style={styles.boldText}>
            - Đánh giá và phản hồi:{" "}
          </Text>
          Sau khi sử dụng dịch vụ, khách hàng có thể để lại đánh giá và phản hồi, giúp các salon và barber shop cải thiện dịch vụ và giúp người dùng khác đưa ra quyết định thông minh.{"\n"}
          <Text style={styles.boldText}>
            - Dễ dàng quản lý lịch sử đặt hẹn:{" "}
          </Text>
          Khách hàng có thể theo dõi lịch sử các lần đặt hẹn và dịch vụ đã sử dụng trên Hairhub, giúp dễ dàng lên kế hoạch cho các lần hẹn tiếp theo.{"\n"}
          <Text style={styles.boldText}>
            - Tìm kiếm các tiệm tóc qua vị trí{" "}
          </Text>
           Hairhub cung cấp công cụ tìm kiếm và định vị giúp khách hàng lựa chọn được các tiệm tóc ở gần mình và phù hợp với nhu cầu, ngân sách của mình.{"\n"}
          <Text style={styles.boldText}>
            - Khuyến mãi và ưu đãi khi đặt lịch trên ứng dụng di động Hairhub:{" "}
          </Text>
          Khách hàng cơ hội nhận được nhiều chương trình khuyến mãi và ưu đãi từ các salon và barber shop thông qua ứng dụng di động của Hairhub cho hệ điều hành android giúp tiết kiệm chi phí và trải nghiệm dịch vụ tốt hơn.
          
        </Text>

        <Text style={styles.header}>Thông Tin Liên Hệ Chính</Text>
        <Text style={styles.text}>
        <Text style={styles.boldText}>
            - Địa Chỉ Văn Phòng:{" "}
          </Text>
          Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức{"\n"}
          <Text style={styles.boldText}>
            - Số Điện Thoại:{" "}
          </Text>
          0706600157{"\n"}
          <Text style={styles.boldText}>
            - Email Hỗ Trợ Khách Hàng:{" "}
          </Text>
           hairhub.business@gmail.com{"\n"}
          <Text style={styles.boldText}>
            - Giờ Làm Việc:{"\n"}
          </Text>
          <Text style={styles.boldText}>
            + Thứ Hai đến Thứ Sáu:{" "}
          </Text>
           8:00 AM - 6:00 PM{"\n"}
          <Text style={styles.boldText}>
            + Thứ Bảy:{" "}
          </Text>
           8:00 AM - 11:30 AM{"\n"}
          <Text style={styles.boldText}>
            + Chủ Nhật:{" "}
          </Text>
           Đóng cửa
        </Text>

        <Text style={styles.header}>Liên Hệ Qua Mạng Xã Hội</Text>
        <Text style={styles.text}>
        <Text style={styles.boldText}>
            - Facebook:{" "}
          </Text>
          www.facebook.com/hairhubvn{"\n"}
          <Text style={styles.boldText}>
            - Instagram:{" "}
          </Text>
           www.instagram.com/hair_hub2024
        </Text>

        <Text style={styles.header}>Hỗ Trợ Trực Tuyến</Text>
        <Text style={styles.text}>
        <Text style={styles.boldText}>
            - Chat Trực Tuyến:{" "}
          </Text>
          Truy cập trang web và sử dụng tính năng chat trực tuyến để nhận hỗ trợ ngay lập tức - www.facebook.com/hairhubvn{"\n"}
          <Text style={styles.boldText}>
            - Hệ Thống Fanpage Facebook:{" "}
          </Text>
           Gửi yêu cầu hỗ trợ qua fanpage Hairhub - www.facebook.com/hairhubvn
        </Text>

        
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutOur;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontWeight: "bold",
    fontSize: SIZES.large,
    textAlign: "center",
    flex: 1,
  },
  upperRow: {
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  contentContainer: {
    padding: 15,
  },
  header: {
    fontWeight: "bold",
    fontSize: SIZES.large,
    marginVertical: 10,
  },
  subHeader: {
    fontWeight: "bold",
    fontSize: SIZES.medium,
    marginVertical: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  text: {
    fontSize: SIZES.small,
    marginBottom: 10,
    lineHeight: 18,
  },
});
