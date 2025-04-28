import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { VaultData } from "@/types/vault";
import { adaptVaultToVaultData } from "@/utils/vaultAdapter";
import { Vault } from "@/types";

export function useVaultDetail(vaultId: string) {
  const {
    data: rawVault,
    isLoading,
    error
  } = useQuery<Vault | undefined>({
    queryKey: ['vault', vaultId],
    queryFn: () => vaultService.getVaultById(vaultId),
    enabled: !!vaultId,
  });

  // Convert Vault to VaultData if available
  const vault = rawVault ? adaptVaultToVaultData(rawVault) : null;

  const getVaultStyles = (id?: string) => {
    if (!id) return {
      gradientText: '',
      gradientBg: '',
      shadow: '',
      bgOpacity: '',
      hoverBg: '',
      textColor: '',
      borderColor: ''
    };

    // Determine vault type based on ID
    let type: 'nova' | 'orion' | 'emerald' | undefined;

    if (id.includes('deep')) {
      type = 'nova';
    } else if (id.includes('cetus')) {
      type = 'orion';
    } else if (id.includes('sui-usdc')) {
      type = 'emerald';
    } else if (id.startsWith('vault-')) {
      // For standard vault ids like 'vault-1', 'vault-2', etc.
      // Default to emerald for even numbers, orion for odd numbers
      const vaultNumber = parseInt(id.replace('vault-', ''), 10);
      type = vaultNumber % 2 === 0 ? 'emerald' : 'orion';
    }

    if (!type) return {
      gradientText: '',
      gradientBg: '',
      shadow: '',
      bgOpacity: '',
      hoverBg: '',
      textColor: '',
      borderColor: ''
    };

    switch (type) {
      case 'nova':
        return {
          gradientText: 'gradient-text-nova',
          gradientBg: 'gradient-bg-nova',
          shadow: 'hover:shadow-neon-nova',
          bgOpacity: 'bg-nova/20',
          hoverBg: 'hover:bg-nova/10',
          textColor: 'text-nova',
          borderColor: 'border-nova/20'
        };
      case 'orion':
        return {
          gradientText: 'gradient-text-orion',
          gradientBg: 'gradient-bg-orion',
          shadow: 'hover:shadow-neon-orion',
          bgOpacity: 'bg-orion/20',
          hoverBg: 'hover:bg-orion/10',
          textColor: 'text-orion',
          borderColor: 'border-orion/20'
        };
      case 'emerald':
        return {
          gradientText: 'gradient-text-emerald',
          gradientBg: 'gradient-bg-emerald',
          shadow: 'hover:shadow-neon-emerald',
          bgOpacity: 'bg-emerald/20',
          hoverBg: 'hover:bg-emerald/10',
          textColor: 'text-emerald',
          borderColor: 'border-emerald/20'
        };
    }
  };

  return {
    vault,
    isLoading,
    error,
    getVaultStyles,
  };
}
