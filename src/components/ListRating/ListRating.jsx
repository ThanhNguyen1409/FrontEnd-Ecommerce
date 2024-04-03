import { List, Avatar, Space, Rate, Flex } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import FormatDateTime from '../../Function/FormatDateTime';
import './ListRating.scss';
const data = [
  {
    avatar: 'Thanh',
    name: 'Thành',
    date: '12-12-2020',
    review:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  // Add more items as needed
];

const ListRating = ({ filterRating }) => (
  <List
    className="list-rating"
    itemLayout="vertical"
    dataSource={filterRating}
    pagination={{
      pageSize: 7,
    }}
    renderItem={(item) => (
      <List.Item>
        <Flex gap={50}>
          <Space direction="horizontal" size={5} align="center">
            <Avatar size={40} icon={<UserOutlined />} />
            <Space direction="vertical" size={0}>
              <span>{item.accountName}</span>
              <span>{FormatDateTime(item.ratingDate)}</span>
            </Space>
          </Space>
          <Space direction="vertical" size={0}>
            <Rate
              disabled
              value={item.ratingStar}
              style={{
                fontSize: 13,
              }}
            />
            <div>{item.ratingText}</div>
          </Space>
        </Flex>
      </List.Item>
    )}
  />
);

export default ListRating;
