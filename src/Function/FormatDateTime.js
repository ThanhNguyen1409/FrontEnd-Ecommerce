import { format, parseISO } from 'date-fns';
import React from 'react';

export default function FormatDateTime(data) {
  const dateObj = parseISO(data);
  return format(dateObj, 'yyyy-MM-dd HH:mm:ss');
}
