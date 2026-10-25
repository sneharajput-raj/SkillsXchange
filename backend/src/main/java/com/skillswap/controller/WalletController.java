package com.skillswap.controller;

import com.skillswap.dto.ApiResponse;
import com.skillswap.dto.TransactionDto;
import com.skillswap.dto.WalletSummaryDto;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.CreditWalletService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wallet")
public class WalletController {

    private final CreditWalletService creditWalletService;

    public WalletController(CreditWalletService creditWalletService) {
        this.creditWalletService = creditWalletService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<WalletSummaryDto>> getWalletSummary(@AuthenticationPrincipal UserPrincipal principal) {
        WalletSummaryDto summary = creditWalletService.getWalletSummary(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Wallet summary retrieved", summary));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<Page<TransactionDto>>> getTransactions(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<TransactionDto> transactions = creditWalletService.getTransactions(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Wallet ledger transactions retrieved", transactions));
    }
}
