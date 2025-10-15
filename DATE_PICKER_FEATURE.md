# Date Picker Filter Feature

## Overview
The Events page now includes an interactive date picker that allows users to filter events by specific dates or date ranges.

## How to Use

1. **Opening the Date Picker**
   - Click on the "Dates" filter button in the Events filter bar
   - A side overlay will appear with the date picker interface

2. **Single Date Filter**
   - Click the "Single Date" button
   - Select a date from the calendar
   - Click "Apply" to filter events for that specific date

3. **Date Range Filter**
   - Click the "Date Range" button
   - Select a start date and an end date from the calendar
   - Click "Apply" to filter events within that date range

4. **Clearing Filters**
   - Click the "Clear" button in the date picker
   - Or use the main filter clear button in the events view

## Technical Implementation

### Components
- **DatePickerFilter** (`components/Filter/DatePickerFilter.js`)
  - Main date picker component with calendar interface
  - Supports both single date and date range selection
  - Provides toast notifications for user feedback

- **Calendar** (`components/ui/calendar.tsx`)
  - ShadCN calendar component built on react-day-picker
  - Customized with app styling

- **Popover** (`components/ui/popover.tsx`)
  - Radix UI popover for overlay functionality

### Filtering Logic
- **searchFilter** utility (`utils/searchFilter.js`) updated to handle:
  - `date:YYYY-MM-DD` - Single date filter format
  - `daterange:YYYY-MM-DD:YYYY-MM-DD` - Date range filter format
  - Traditional string-based search remains unchanged

### Dependencies
- `react-day-picker@^8.10.0` - Calendar component
- `date-fns@^4.1.0` - Date manipulation and formatting
- `@radix-ui/react-popover@^1.1.15` - Popover overlay

## Features
- ✅ Single date selection
- ✅ Date range selection
- ✅ Actual date comparison (not string-based)
- ✅ Toast notifications for user feedback
- ✅ Clear/Reset functionality
- ✅ Responsive design
- ✅ Integrated with existing filter system
- ✅ Consistent styling with app theme
