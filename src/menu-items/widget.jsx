// third-party
import { FormattedMessage } from 'react-intl';

// assets
import LineChartOutlined from '@ant-design/icons/LineChartOutlined';
import IdcardOutlined from '@ant-design/icons/IdcardOutlined';
import DatabaseOutlined from '@ant-design/icons/DatabaseOutlined';

// type

// icons
const icons = { LineChartOutlined, IdcardOutlined, DatabaseOutlined };

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const widget = {
  id: 'group-widget',
  title: <FormattedMessage id="widgets" />,
  icon: icons.IdcardOutlined,
  type: 'group',
  children: [
    // {
    //   id: 'statistics',
    //   title: <FormattedMessage id="statistics" />,
    //   type: 'item',
    //   url: '/widget/statistics',
    //   icon: icons.IdcardOutlined
    // },
    // {
    //   id: 'data',
    //   title: <FormattedMessage id="data" />,
    //   type: 'item',
    //   url: '/widget/data',
    //   icon: icons.DatabaseOutlined
    // },
    // {
    //   id: 'chart',
    //   title: <FormattedMessage id="chart" />,
    //   type: 'item',
    //   url: '/widget/chart',
    //   icon: icons.LineChartOutlined
    // },
    {
      id: 'Employee',
      title: <FormattedMessage id="Employee" />,
      type: 'item',
      url: '/widget/Employee',
      icon: icons.LineChartOutlined
    },
    {
      id: 'Contacts',
      title: <FormattedMessage id="Contacts" />,
      type: 'item',
      url: '/widget/Contacts',
      icon: icons.LineChartOutlined
    },
    {
      id: 'Clients',
      title: <FormattedMessage id="Clients" />,
      type: 'item',
      url: '/widget/Clients',
      icon: icons.LineChartOutlined
    },
    {
      id: 'Leads',
      title: <FormattedMessage id="Leads" />,
      type: 'item',
      url: '/widget/Leads',
      icon: icons.LineChartOutlined
    }
  ]
};

export default widget;
