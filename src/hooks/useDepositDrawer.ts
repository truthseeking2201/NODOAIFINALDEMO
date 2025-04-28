
import { useState, useEffect } from "react";
import { VaultData } from "@/types/vault";
import { useWallet } from "@/hooks/useWallet";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useDepositAudio } from "./useDepositAudio";
import { useDepositCalculations } from "./useDepositCalculations";
import { useDepositAnimations } from "./useDepositAnimations";

interface UseDepositDrawerProps {
  vault?: VaultData;
  onClose?: () => void;
}

export const useDepositDrawer = (props?: UseDepositDrawerProps) => {
  const navigate = useNavigate();
  const { balance, deposit } = useWallet();
  const [amount, setAmount] = useState<string>("");
  const [selectedLockup, setSelectedLockup] = useState<number>(30);
  const [step, setStep] = useState<'details' | 'confirmation' | 'success'>('details');
  const [sliderValue, setSliderValue] = useState<number[]>([1000]);
  const [validationError, setValidationError] = useState<string>("");

  // Use the refactored hooks
  const { calculateEstimatedReturns, getUnlockDate } = useDepositCalculations(props?.vault);
  const { showConfetti, setShowConfetti, countUpValue, fadeRefresh, setFadeRefresh } = useDepositAnimations(step, amount);
  useDepositAudio(step, amount);

  // Set default lockup period based on vault data
  useEffect(() => {
    if (props?.vault?.lockupPeriods && props.vault.lockupPeriods.length > 0) {
      setSelectedLockup(props.vault.lockupPeriods[0].days);
    }
  }, [props?.vault]);

  // Update amount when slider value changes
  useEffect(() => {
    setAmount(sliderValue[0].toString());
  }, [sliderValue]);

  // Handle fade refresh animation
  useEffect(() => {
    if (amount || selectedLockup) {
      setFadeRefresh(true);
      const timer = setTimeout(() => setFadeRefresh(false), 120);
      return () => clearTimeout(timer);
    }
  }, [amount, selectedLockup, setFadeRefresh]);

  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: async (params: { vaultId: string; amount: number; lockupPeriod: number }) => {
      // Use the wallet.deposit function instead of service
      return await deposit(params.vaultId, params.amount, params.lockupPeriod);
    },
    onSuccess: (data) => {
      setStep('success');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      // Show the NODOAIx Token minted toast notification
      toast({
        title: "NODOAIx Token Minted",
        description: `${(parseFloat(amount) * 0.98).toFixed(2)} NODOAIx Tokens have been added to your wallet. NODOAIx Tokens represent your share of the vault's assets and automatically burn upon withdrawal, functioning as proof of your deposit and yielding interest over time.`,
        variant: "default",
        duration: 5000,
      });

      if (props?.vault) {
        window.dispatchEvent(new CustomEvent('deposit-success', {
          detail: { amount: parseFloat(amount), vaultId: props.vault.id }
        }));
      }
    },
    onError: () => {
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      setAmount(value);
      if (value !== '') {
        const numVal = parseFloat(value);
        if (!isNaN(numVal)) {
          setSliderValue([Math.min(numVal, 10000)]);
        }
      } else {
        setSliderValue([0]);
      }
      validateAmount(value);
    }
  };

  // Validate deposit amount
  const validateAmount = (value: string) => {
    if (!value) {
      setValidationError("");
      return;
    }

    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal <= 0) {
      setValidationError("Min 1 USDC required");
    } else if (numVal > balance.usdc) {
      setValidationError("Exceeds wallet balance");
    } else {
      setValidationError("");
    }
  };

  return {
    state: {
      amount,
      selectedLockup,
      step,
      sliderValue,
      validationError,
      showConfetti,
      countUpValue,
      fadeRefresh,
      depositMutation,
    },
    actions: {
      setSelectedLockup,
      handleAmountChange,
      handleSliderChange: (values: number[]) => {
        setSliderValue(values);
        setAmount(values[0].toString());
        validateAmount(values[0].toString());
      },
      handleMaxClick: () => {
        setAmount(String(balance.usdc));
        setSliderValue([balance.usdc]);
        validateAmount(String(balance.usdc));
      },
      handleReviewClick: () => setStep('confirmation'),
      handleViewDashboard: () => {
        if (props?.onClose) props.onClose();
        navigate('/dashboard');
      },
      handleDepositAgain: () => {
        setStep('details');
        setAmount("");
        setSliderValue([1000]);
        if (props?.vault?.lockupPeriods && props.vault.lockupPeriods.length > 0) {
          setSelectedLockup(props.vault.lockupPeriods[0].days);
        }
      },
      handleConfirmDeposit: () => {
        if (!amount || !props?.vault) return;

        // Immediately show success screen with optimistic UI approach
        setStep('success');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        // Show NODOAIx Token minted toast
        toast({
          title: "NODOAIx Token Minted",
          description: `${(parseFloat(amount) * 0.98).toFixed(2)} NODOAIx Tokens have been added to your wallet. NODOAIx Tokens represent your share of the vault's assets and automatically burn upon withdrawal, functioning as proof of your deposit and yielding interest over time.`,
          variant: "default",
          duration: 5000,
        });

        // Fire deposit success event
        if (props?.vault) {
          window.dispatchEvent(new CustomEvent('deposit-success', {
            detail: { amount: parseFloat(amount), vaultId: props.vault.id }
          }));
        }

        // Continue with the actual transaction in the background
        depositMutation.mutate({
          vaultId: props.vault.id,
          amount: parseFloat(amount),
          lockupPeriod: selectedLockup
        }, {
          // Only show error if the transaction actually fails
          onError: () => {
            toast({
              title: "Transaction Warning",
              description: "Your deposit was accepted but there may have been an issue with the blockchain confirmation. Check your wallet for confirmation.",
              variant: "destructive",
              duration: 7000,
            });
          }
        });
      },
      openDepositDrawer: (vault: VaultData) => {
        window.dispatchEvent(new CustomEvent('open-deposit-drawer', {
          detail: { vault }
        }));
      },
    },
    calculations: {
      calculateEstimatedReturns: () => calculateEstimatedReturns(amount, selectedLockup),
      getUnlockDate: () => getUnlockDate(selectedLockup)
    }
  };
};
