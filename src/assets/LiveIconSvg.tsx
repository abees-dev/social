import { Box, BoxProps } from '@mui/material';

export default function LiveIconSvg({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        ...sx,
      }}
      {...other}
    >
      <img
        width="100%"
        height="100%"
        src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTggMGE4IDggMCAxIDAgMCAxNkE4IDggMCAwIDAgOCAwWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4xNjIgNy4zMzhjLjE3Ni4xMjMuMzM4LjI0NS4zMzguNjc0IDAgLjQzLS4yMjkuNjA0LS40NzQuNzI1LjEuMTYzLjEzMi4zNi4wODkuNTQ2LS4wNzcuMzQ0LS4zOTIuNjExLS42NzIuNjkuMTIxLjE5NC4xNTkuMzg1LjAxNS42Mi0uMTg1LjI5NS0uMzQ2LjQwNy0xLjA1OC40MDdINy41Yy0uOTg4IDAtMS41LS41NDYtMS41LTFWNy42NjVjMC0xLjIzIDEuNDY3LTIuMjc1IDEuNDY3LTMuMTNMNy4zNjEgMy40N2MtLjAwNS0uMDY1LjAwOC0uMjI0LjA1OC0uMjcuMDgtLjA3OS4zMDEtLjIuNjM1LS4yLjIxOCAwIC4zNjMuMDQxLjUzNC4xMjMuNTgxLjI3Ny43MzIuOTc4LjczMiAxLjU0MiAwIC4yNzEtLjQxNCAxLjA4My0uNDcgMS4zNjQgMCAwIC44NjctLjE5MiAxLjg3OS0uMTk5IDEuMDYxLS4wMDYgMS43NDkuMTkgMS43NDkuODQyIDAgLjI2MS0uMjE5LjUyMy0uMzE2LjY2NlpNMy42IDdoLjhhLjYuNiAwIDAgMSAuNi42djMuOGEuNi42IDAgMCAxLS42LjZoLS44YS42LjYgMCAwIDEtLjYtLjZWNy42YS42LjYgMCAwIDEgLjYtLjZaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iOCIgeDI9IjgiIHkyPSIxNiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMxOEFGRkYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDYyREYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4="
        alt=""
      />
    </Box>
  );
}
