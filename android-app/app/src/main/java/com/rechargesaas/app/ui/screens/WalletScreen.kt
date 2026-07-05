package com.rechargesaas.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rechargesaas.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WalletScreen(
    onNavigateBack: () -> Unit,
    onTransferSuccess: (recipient: String, amount: Double) -> Unit
) {
    var recipientPhone by remember { mutableStateOf("") }
    var transferAmount by remember { mutableStateOf("") }
    var ledgerReference by remember { mutableStateOf("") }
    var isProcessing by remember { mutableStateOf(false) }
    var showDialog by remember { mutableStateOf(false) }
    var errorMsg by remember { mutableStateOf<String?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Main Wallet Ledger", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextPrimaryDark)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = BackgroundDark)
            )
        },
        containerColor = BackgroundDark
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Wallet stats banner
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(SurfaceDark)
                        .border(1.dp, CardBorderDark, RoundedCornerShape(16.dp))
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Info, contentDescription = "Info", tint = PrimaryDark, modifier = Modifier.size(28.dp))
                    Column {
                        Text("Ledger Account: Main Balance", fontSize = 11.sp, color = TextSecondaryDark, fontFamily = FontFamily.Monospace)
                        Text("$12,450.00", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = SecondaryDark)
                    }
                }

                // Balance transfers card
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(SurfaceDark)
                        .border(1.dp, CardBorderDark, RoundedCornerShape(16.dp))
                        .padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Text("PEER-TO-PEER BALANCE DISPERSAL", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextSecondaryDark, fontFamily = FontFamily.Monospace)

                    if (errorMsg != null) {
                        Text(errorMsg!!, color = AccentRose, fontSize = 11.sp)
                    }

                    OutlinedTextField(
                        value = recipientPhone,
                        onValueChange = { recipientPhone = it },
                        label = { Text("Recipient Agent Phone Number", color = TextSecondaryDark) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrimaryDark,
                            unfocusedBorderColor = CardBorderDark,
                            focusedTextColor = TextPrimaryDark,
                            unfocusedTextColor = TextPrimaryDark
                        ),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
                    )

                    OutlinedTextField(
                        value = transferAmount,
                        onValueChange = { transferAmount = it },
                        label = { Text("Transfer Amount ($)", color = TextSecondaryDark) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = SecondaryDark,
                            unfocusedBorderColor = CardBorderDark,
                            focusedTextColor = TextPrimaryDark,
                            unfocusedTextColor = TextPrimaryDark
                        ),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                    )

                    OutlinedTextField(
                        value = ledgerReference,
                        onValueChange = { ledgerReference = it },
                        label = { Text("External Reference Memo (Optional)", color = TextSecondaryDark) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CardBorderDark,
                            unfocusedBorderColor = CardBorderDark,
                            focusedTextColor = TextPrimaryDark,
                            unfocusedTextColor = TextPrimaryDark
                        ),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Button(
                        onClick = {
                            val amt = transferAmount.toDoubleOrNull()
                            if (recipientPhone.isBlank() || amt == null || amt <= 0) {
                                errorMsg = "Please verify recipient and input values"
                            } else if (amt > 12450.0) {
                                errorMsg = "Insufficient balance inside wallet ledger"
                            } else {
                                isProcessing = true
                                errorMsg = null
                                showDialog = true
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryDark),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("AUTHORIZE P2P TRANSFER", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            if (showDialog) {
                AlertDialog(
                    onDismissRequest = { showDialog = false },
                    title = { Text("P2P Ledger Dispersal Complete", color = TextPrimaryDark) },
                    text = {
                        Text(
                            "The balance transfer of $${transferAmount} to $recipientPhone has been executed with reference memo: '$ledgerReference'.",
                            color = TextSecondaryDark,
                            fontSize = 12.sp
                        )
                    },
                    confirmButton = {
                        TextButton(
                            onClick = {
                                showDialog = false
                                recipientPhone = ""
                                transferAmount = ""
                                ledgerReference = ""
                                onTransferSuccess(recipientPhone, transferAmount.toDoubleOrNull() ?: 0.0)
                            }
                        ) {
                            Text("OK", color = SecondaryDark)
                        }
                    },
                    containerColor = SurfaceDark
                )
            }
        }
    }
}
