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

const Policy = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Chính sách & Điều khoản sử dụng</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>Điều Khoản Sử Dụng của Hairhub</Text>
        <Text style={styles.text}>
          Các điều khoản sử dụng của Hairhub nhằm đảm bảo khách hàng và chúng
          tôi đều tuân thủ pháp luật, đồng thời bảo vệ quyền lợi và bảo mật
          thông tin trong quá trình sử dụng dịch vụ. Khi bạn tạo tài khoản và sử
          dụng dịch vụ của Hairhub, bạn đồng ý và chấp thuận với các điều khoản
          sử dụng mà chúng tôi đưa ra.
        </Text>
        <Text style={styles.subHeader}>1. Trách Nhiệm của Hairhub</Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>
            - Cam Kết Cung Cấp Dịch Vụ Đúng Hẹn và Chất Lượng:{" "}
          </Text>
          Hairhub cam kết cung cấp dịch vụ đặt lịch cắt tóc và các dịch vụ liên
          quan đúng hẹn và chất lượng.{"\n"}
          <Text style={styles.boldText}>
            - Không Chịu Trách Nhiệm về Hành Vi Của Các Salon, Barber shop:{" "}
          </Text>
          Hairhub không chịu trách nhiệm đối với các hành vi của các salon hoặc
          barber shop sử dụng nền tảng của chúng tôi. Chúng tôi không can thiệp
          vào hoạt động hoặc chất lượng dịch vụ của các đối tác.{"\n"}
          <Text style={styles.boldText}>
            - Không có Trách Nhiệm về Sự Cố Không Được Dự Đoán:{" "}
          </Text>
          Hairhub không có nghĩa vụ giám sát các hoạt động của người sử dụng
          dịch vụ và từ chối mọi trách nhiệm đối với các sự cố phát sinh do việc
          lạm dụng hoặc sử dụng sai mục đích dịch vụ.{"\n"}
          <Text style={styles.boldText}>- Hỗ Trợ Khách Hàng: </Text>
          Chúng tôi tiếp nhận và hỗ trợ các yêu cầu của khách hàng qua trang
          FanpageHairhub
        </Text>

        <Text style={styles.subHeader}>2. Trách Nhiệm của Khách Hàng</Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>- Tuân Thủ Pháp Luật: </Text>
          Khách hàng phải tuân thủ Hiến pháp và pháp luật của nước Cộng hòa xã
          hội chủ nghĩa Việt Nam khi sử dụng dịch vụ.{"\n"}
          <Text style={styles.boldText}>- Cung Cấp Thông Tin Chính Xác: </Text>
          Khách hàng phải cung cấp thông tin liên hệ đầy đủ và chính xác bao gồm
          họ tên, địa chỉ, email, số điện thoại. Nếu chuyển giao quyền quản lý
          tài khoản hoặc dịch vụ, khách hàng cần cập nhật thông tin liên hệ
          trong hệ thống của Hairhub.{"\n"}
          <Text style={styles.boldText}>
            - Bảo Quản Dữ Liệu và bảo Mật Thông Tin:{" "}
          </Text>
          Khách hàng phải tự chịu trách nhiệm bảo quản dữ liệu trên hệ thống.
          Khách hàng phải bảo mật thông tin liên quan đến tài khoản và dịch vụ,
          và thông báo ngay cho Hairhub khi phát hiện truy cập trái phép hoặc sự
          cố bảo mật.{"\n"}
          <Text style={styles.boldText}>- Đảm Bảo An Toàn Thiết Bị: </Text>
          Khách hàng có trách nhiệm bảo đảm an toàn cho thiết bị truy cập dịch
          vụ của mình, bao gồm việc sử dụng phần mềm bảo mật như diệt virus và
          tường lửa.{"\n"}
          <Text style={styles.boldText}>- Đối với tiệm tóc: </Text>
          Chủ tiệm tóc phải có trách nhiệm đảm bảo các thông tin của salon,
          barber shop tuân thủ theo quy định pháp luật, các lịch hẹn của khách
          hàng trên hệ thống Hairhub được hoàn thành toàn vẹn theo đúng nhân
          viên, dịch vụ của tiệm tóc và thời gian đặt lịch trên hệ thống.
          Hairhub sẽ không chịu trách nhiệm cho các khách hàng không tuân thủ
          theo quy định.{"\n"}
          <Text style={styles.boldText}>- Đối với khách hàng đặt lịch: </Text>
          Khách hàng đặt lịch phải có trách nhiệm về cuộc hẹn của mình đối với
          các tiệm tóc trên hệ thống Hairhub. Thực hiện đúng theo theo quy trình
          đặt lịch, đến tiệm tóc đúng giờ và checkin đúng cách. Hairhub sẽ không
          chịu trách nhiệm cho các khách hàng không tuân thủ theo quy định.
        </Text>

        <Text style={styles.subHeader}>
          3. Các Hình Thức Sử Dụng Không Được Chấp Nhận
        </Text>
        <Text style={styles.text}>
          Khách hàng không được phép thực hiện các hành vi sau:{"\n"}
          <Text style={styles.boldText}>
            - Vi Phạm Liên Quan Đến Hệ Thống và Mạng:{"\n"}{" "}
          </Text>
          + Sử dụng dịch vụ để tấn công, truy cập trái phép, hoặc gây ảnh hưởng
          đến hệ thống của Hairhub hoặc các bên thứ ba.{"\n"}+ Phát tán các phần
          mềm gây hại như virus, trojan, hoặc can thiệp vào hệ thống kiểm soát
          của Hairhub.{"\n"}
          <Text style={styles.boldText}>- Vi Phạm Về Bảo Mật:{"\n"} </Text>+
          Truy cập, sử dụng dữ liệu hoặc hệ thống trái phép, bao gồm hành vi
          thăm dò và kiểm tra lỗ hổng bảo mật mà không có sự đồng ý.{"\n"}
          <Text style={styles.boldText}>- Vi Phạm Nội Dung:{"\n"} </Text>+ Lưu
          trữ hoặc phát tán các thông tin vi phạm pháp luật hoặc các nội dung
          không phù hợp theo quy định của pháp luật và các chuẩn mực xã hội.
        </Text>

        <Text style={styles.subHeader}>4. Ngừng Cung Cấp Dịch Vụ</Text>
        <Text style={styles.text}>
          Hairhub có thể ngừng cung cấp dịch vụ trong các trường hợp sau:{"\n"}-
          Khách hàng vi phạm các hình thức quy định trong mục 3.{"\n"}- Tổng số
          lượng báo cáo của tiệm tóc đối với khách hàng đặt lịch được admin
          duyệt trên 4 lần.{"\n"}- Khách hàng khai báo thông tin không đúng,
          thông tin nhạy cảm không tuân thủ quy tác của pháp luật hoặc có dấu
          hiệu gian lận.
        </Text>

        <Text style={styles.subHeader}>5. Thay Đổi Điều Khoản Sử Dụng</Text>
        <Text style={styles.text}>
          Hairhub có thể thay đổi, sửa đổi, bổ sung hoặc thay thế các điều khoản
          sử dụng bất cứ khi nào để phù hợp với quy định pháp luật. Mọi thay đổi
          sẽ có hiệu lực kể từ khi được công bố trên website và fanpage của
          Hairhub.
        </Text>

        <Text style={styles.header}>Chính sách báo cáo</Text>
        <Text style={styles.text}>
          - Khách hàng đặt lịch có thể tạo các báo cáo đối với tiệm tóc về hành
          vi, thái độ không tuân theo quy chuẩn đạo đức, không đúng hẹn lịch
          hẹn, nhân viên, dịch vụ hoặc các trường hợp không tuân theo quy định
          của Hairhub.{"\n"}- Đối với các báo cáo từ tiệm tóc đến khách hàng đặt
          lịch, sau khi được admin kiểm tra, thẩm định và phê duyệt, khách hàng
          đặt lịch sẽ không được cung cấp bất kỳ dịch vụ nào trên Hairhub nếu
          tổng số đơn báo cáo hợp lệ vượt quá mức 4 đơn báo cáo.
        </Text>

        <Text style={styles.header}>Chính sách bảo mật</Text>
        <Text style={styles.text}>
          Bảo mật thông tin cá nhân luôn được Hairhub đặt lên hàng đầu. Chúng
          tôi cam kết giữ kín và bảo mật thông tin cá nhân của khách hàng dựa
          trên các nguyên tắc được nêu trong chính sách bảo mật này. Khi khách
          hàng truy cập và sử dụng hệ thống Hairhub, có nghĩa là khách hàng đã
          hoàn toàn đồng ý với các điều khoản của chính sách bảo mật này.
        </Text>

        <Text style={styles.subHeader}>
          1. Thông tin cá nhân do khách hàng cung cấp
        </Text>
        <Text style={styles.text}>
          - Khi khách hàng cung cấp các thông tin cần thiết cho Hairhub, chúng
          tôi sẽ sử dụng thông tin đó để đáp ứng yêu cầu của khách hàng hoặc
          liên lạc với khách hàng qua email, tin nhắn, điện thoại để trao đổi về
          dịch vụ. Việc này đồng nghĩa với việc khách hàng đã hiểu rõ và chấp
          thuận việc thu thập và sử dụng thông tin cá nhân cho các mục đích của
          hệ thống và lưu trữ thông tin tại cơ sở dữ liệu của Hairhub. Nếu khách
          hàng đăng ký sử dụng dịch vụ của Hairhub hoặc gửi thư phản hồi, chúng
          tôi có thể yêu cầu bổ sung thông tin cần thiết để xử lý hoặc hoàn
          thành yêu cầu của khách hàng. Thông tin cá nhân này sẽ được bảo mật,
          và Hairhub sẽ không cung cấp cho bên thứ ba nếu không được sự cho phép
          của khách hàng, trừ trường hợp pháp luật yêu cầu.{"\n"}- Hairhub cam
          kết bảo vệ thông tin cá nhân của khách hàng và không bán thông tin cá
          nhân của khách hàng cho các công ty khác vì bất kỳ mục đích gì.
        </Text>

        <Text style={styles.subHeader}>2. Sử dụng thông tin cá nhân</Text>
        <Text style={styles.text}>
          Hairhub có thể sử dụng thông tin cá nhân của khách hàng trong các
          trường hợp sau:{"\n"}- Xác nhận thanh toán và hỗ trợ dịch vụ.{"\n"}-
          Thông báo gia hạn dịch vụ đến khách hàng.{"\n"}- Giới thiệu các sản
          phẩm – dịch vụ mới hoặc chương trình khuyến mãi của Hairhub.{"\n"}
          Chúng tôi có thể chủ động hoặc theo yêu cầu của khách hàng để bổ sung,
          chỉnh sửa các dữ liệu thông tin cá nhân không chính xác, không đầy đủ
          hoặc không cập nhật khi khách hàng còn liên kết với Hairhub.
        </Text>

        <Text style={styles.subHeader}>
          3. Bảo mật thông tin của khách hàng
        </Text>
        <Text style={styles.text}>
          Để bảo vệ tính toàn vẹn và an toàn của thông tin cá nhân, Hairhub lưu
          trữ thông tin cá nhân và thông tin thanh toán của khách hàng trong một
          định dạng an toàn đã được mã hóa. Chỉ có đội ngũ nhân viên được ủy
          quyền của Hairhub mới có quyền truy cập các thông tin này. Mặc dù
          chúng tôi nỗ lực thực hiện các biện pháp bảo mật thích hợp, không có
          hệ thống kỹ thuật nào hoàn toàn an toàn trước các nguy cơ xâm nhập
          hoặc tấn công. Hairhub luôn cố gắng giảm thiểu rủi ro và bảo vệ thông
          tin cá nhân của khách hàng một cách tốt nhất.
        </Text>

        <Text style={styles.subHeader}>4. Thông tin qua e-mail</Text>
        <Text style={styles.text}>
          - Khi đăng ký dịch vụ, địa chỉ email khách hàng cung cấp sẽ được sử
          dụng để trao đổi thông tin. Khách hàng cần đảm bảo địa chỉ email đã
          cung cấp là chính xác và hoạt động trong suốt thời gian sử dụng dịch
          vụ. Hairhub có thể gửi các thông tin quan trọng qua email hoặc tiếp
          nhận yêu cầu hỗ trợ từ khách hàng. Nếu khách hàng thay đổi địa chỉ
          email, vui lòng thông báo cho Hairhub ngay lập tức.{"\n"}- Để bảo vệ
          thông tin cá nhân của khách hàng, Hairhub có thể tạm thời ngưng tiếp
          nhận yêu cầu qua email nếu phát hiện có sự gian lận hoặc thông tin bất
          thường cho đến khi chúng tôi xác nhận được thông tin từ khách hàng.
        </Text>

        <Text style={styles.subHeader}>
          5. Các liên kết ngoài trang web của Hairhub
        </Text>
        <Text style={styles.text}>
          Trang web của Hairhub có thể chứa các liên kết đến các trang web khác
          nhằm mục đích cung cấp thêm thông tin cho khách hàng. Hairhub không
          chịu trách nhiệm về nội dung hoặc hành vi của bất kỳ trang web nào
          khác. Khách hàng nên tự kiểm tra chính sách bảo mật của các trang web
          này khi truy cập.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

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

export default Policy;
