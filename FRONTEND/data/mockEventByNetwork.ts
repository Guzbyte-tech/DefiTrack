export const mockEventsByNetwork = {
  ethereum: [
    {
      id: 1,
      type: "protection" as const,
      message: "DeFi Track protection triggered at block 18,234,567",
      timestamp: "2 minutes ago",
      saved: 1020,
    },
    {
      id: 2,
      type: "warning" as const,
      message: "Health factor dropped below 1.2 threshold",
      timestamp: "5 minutes ago",
    },
  ],
  base: [
    {
      id: 1,
      type: "info" as const,
      message: "Position monitoring started on Base",
      timestamp: "30 minutes ago",
    },
  ],
  optimism: [
    {
      id: 1,
      type: "warning" as const,
      message: "Health factor approaching critical level",
      timestamp: "1 hour ago",
    },
  ],
  arbitrum: [
    {
      id: 1,
      type: "protection" as const,
      message: "Test protection executed successfully",
      timestamp: "10 minutes ago",
      saved: 250,
    },
    {
      id: 2,
      type: "info" as const,
      message: "Testnet position created",
      timestamp: "2 hours ago",
    },
  ],
}