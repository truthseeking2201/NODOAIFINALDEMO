# Debugging Guide for Nodo AI Yield Vault

## "Unable to Load Vaults" Error

If you're seeing the "Unable to Load Vaults" error screen, here's how to fix it:

### Understanding the Issue

This error occurs when the application encounters an error while fetching vault data. In the demo environment, this error is simulated for UI testing purposes.

### How to Fix It

1. Open the file: `src/services/vaultService.ts`

2. Locate the `getVaults` method (around line 293)

3. You'll see code that looks like this:

```typescript
async getVaults(): Promise<Vault[]> {
  try {
    // For demonstration purposes:
    // Return actual vaults (normal operation)
    return Promise.resolve(this.vaults);

    // IMPORTANT: The line below is deliberately placed after a return statement
    // to ensure it never executes. To test the error UI, move this line ABOVE
    // the return statement and uncomment it.
    // throw new Error("API connection error");
  } catch (error) {
    console.error("Error fetching vaults:", error);
    // In a real application, you might want to propagate the error
    // but for this demo, we'll fall back to returning vaults
    return Promise.resolve(this.vaults);
  }
}
```

#### To show the error screen (for testing UI):

```typescript
async getVaults(): Promise<Vault[]> {
  try {
    // Uncomment the next line to simulate an error
    throw new Error("API connection error");

    // Comment out or remove this return when testing error state
    // return Promise.resolve(this.vaults);
  } catch (error) {
    console.error("Error fetching vaults:", error);
    // To see the error UI, remove the next line:
    // return Promise.resolve(this.vaults);
    throw error; // Re-throw to trigger error UI
  }
}
```

#### To show vaults normally (fix the error):

```typescript
async getVaults(): Promise<Vault[]> {
  try {
    // This is the normal operation that returns vaults
    return Promise.resolve(this.vaults);

    // Keep this line commented out for normal operation
    // throw new Error("API connection error");
  } catch (error) {
    console.error("Error fetching vaults:", error);
    // For demo purposes, return vaults even if an error occurs
    return Promise.resolve(this.vaults);
  }
}
```

### React Query Configuration

If you're still experiencing issues, check the React Query configuration in `src/pages/VaultCatalog.tsx`:

```typescript
const { data: rawVaults, isLoading, error, refetch } = useQuery<Vault[]>({
  queryKey: ['vaults'],
  queryFn: () => vaultService.getVaults(),
  retry: 3,
  retryDelay: 1000,
  refetchOnWindowFocus: false,
});
```

You may need to adjust the retry parameters based on your needs.

## Other Common Issues

### Empty Vault List

If you're seeing "No Vaults Available" instead of the vaults:

1. Check that the `vaults` array in `vaultService.ts` has items
2. Verify that the React Query is correctly resolving
3. Check the console for any errors

### Wallet Connection Issues

If the wallet connection feature is not working:

1. Verify the wallet hook implementation in `src/hooks/useWallet.tsx`
2. Check that the wallet connection modal is properly configured

## Need Further Help?

Please open an issue on the repository with:
- A screenshot of the error
- Steps to reproduce
- Any console errors you're seeing
