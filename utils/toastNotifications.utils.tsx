import type { ToastContentProps } from 'react-toastify';
import { toast } from 'react-toastify';
import { BugIcon } from '../components/icons/Icons';
import { RoutePaths } from '../enums/RoutePaths';
import '../styles/toast.styles.css';

type ToastType = 'success' | 'error' | 'info';

interface CustomToastProps extends Partial<ToastContentProps> {
  type: ToastType;
  title: string;
  message: string;
}

const CheckIconSvg = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.33398 5.66699L4.00065 8.33366L10.6673 1.66699" stroke="#C5FFD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XIconSvg = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.99997 1.00003L1 9M0.999966 1L8.99993 8.99997" stroke="#FFF2F2" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const InfoIconSvg = () => (
  <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_10222_6414)">
      <path d="M9.5 12V9M9.5 6H9.5075M17 9C17 13.1421 13.6421 16.5 9.5 16.5C5.35786 16.5 2 13.1421 2 9C2 4.85786 5.35786 1.5 9.5 1.5C13.6421 1.5 17 4.85786 17 9Z" stroke="#CFEDFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges"/>
    </g>
    <defs>
      <filter id="filter0_d_10222_6414" x="-2.75" y="0.75" width="24.5" height="24.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10222_6414"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_10222_6414" result="shape"/>
      </filter>
    </defs>
  </svg>
);

const config = {
  success: {
    background: 'linear-gradient(90deg, #101010 0%, #050505 100%)',
    iconBg: '#19A055',
    Icon: CheckIconSvg,
  },
  error: {
    background: 'linear-gradient(90deg, #101010 0%, #050505 100%)',
    iconBg: '#FF5858',
    Icon: XIconSvg,
  },
  info: {
    background: 'linear-gradient(90deg, #101010 0%, #050505 100%)',
    iconBg: '#1A7EBC',
    Icon: InfoIconSvg,
  },
};

export function CustomToast({
  type,
  title,
  message,
  closeToast,
}: CustomToastProps) {
  const { background, iconBg, Icon } = config[type];

  return (
    <View
      className="box-border flex gap-2 items-center px-6 py-5 text-white rounded-2xl min-w-[360px] border border-[#282828] font-geist"
      style={{ background, borderRadius: '16px' }}
    >
      <View className="flex-1">
        <View className="font-geist font-semibold text-base leading-[140%]">{title}</View>
        <View className="font-geist font-normal text-xs leading-[160%]">{message}</View>
        {type === 'error' && (
          <a
            href={`${RoutePaths.BUG_REPORTS}?open=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs font-medium underline text-alert-red flex space-x-1.5 items-center"
            onClick={e => e.stopPropagation()}
          >
            <BugIcon className='w-3.5 h-3'/>
            <Text>Report bug</Text>
          </a>
        )}
      </View>
      <button
        onClick={closeToast}
        className="flex justify-center items-center rounded-xl border-none cursor-pointer size-8"
        style={{ background: iconBg }}
      >
        <Icon />
      </button>
    </View>
  );
}

const toastNotifications = {
  success: (title: string, details: string = '') => {
    toast(
      <CustomToast
        type="success"
        title={title}
        message={details}
      />,
      { closeButton: false, autoClose: 2500, hideProgressBar: true }
    );
  },
  error: (title: string, details: string = '') => {
    toast(
      <CustomToast
        type="error"
        title={title}
        message={details}
      />,
      { closeButton: false, autoClose: 5000, hideProgressBar: true }
    );
  },
  info: (title: string, details: string = '') => {
    toast(
      <CustomToast
        type="info"
        title={title}
        message={details}
      />,
      { closeButton: false, autoClose: 2500, hideProgressBar: true }
    );
  },
};

export default toastNotifications;
