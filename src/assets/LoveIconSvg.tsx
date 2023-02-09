import { Box, BoxProps } from '@mui/material';

export default function LoveIcon({ sx, ...other }: BoxProps) {
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
        src="data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTggMGE4IDggMCAxIDAgMCAxNkE4IDggMCAwIDAgOCAwWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMC40NzMgNEM4LjI3NSA0IDggNS44MjQgOCA1LjgyNFM3LjcyNiA0IDUuNTI4IDRjLTIuMTE0IDAtMi43MyAyLjIyMi0yLjQ3MiAzLjQxQzMuNzM2IDEwLjU1IDggMTIuNzUgOCAxMi43NXM0LjI2NS0yLjIgNC45NDUtNS4zNGMuMjU3LTEuMTg4LS4zNi0zLjQxLTIuNDcyLTMuNDFaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iOCIgeDI9IjgiIHkyPSIxNiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNGRjY2ODAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNFNjE3MzkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4="
        alt=""
      />
    </Box>
  );
}
