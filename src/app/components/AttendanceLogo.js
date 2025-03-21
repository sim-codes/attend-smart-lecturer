export default function AttendanceLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="320"
      height="37"
      viewBox="0 0 180 37"
      fill="none"
      className="dark:invert"
    >
      <path
        d="M10 5H25C26.1046 5 27 5.89543 27 7V30C27 31.1046 26.1046 32 25 32H10C8.89543 32 8 31.1046 8 30V7C8 5.89543 8.89543 5 10 5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 12H23M12 18H23M12 24H18"
        stroke="currentColor"
        strokeWidth="2"
      />
      <text x="35" y="24" fontSize="20" fill="currentColor" fontWeight="bold">
        Attendance Report
      </text>
    </svg>
  );
}
