// https://day.js.org/en/
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('ko');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);
// dayjs.tz.setDefault('Asia/Seoul');

export default (context, inject) => {
	inject('dayjs', dayjs);
};
