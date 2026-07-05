package com.rechargesaas.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rechargesaas.app.ui.theme.*

data class TransactionItem(
    val id: String,
    val type: String,
    val number: String,
    val operator: String,
    val amount: Double,
    val status: String,
    val timestamp: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    userRole: String,
    onNavigateToRecharge: () -> Unit,
    onNavigateToWallet: () -> Unit,
    onLogout: () -> Unit
) {
    var balance by remember { mutableStateOf(12450.00) }
    var commissions by remember { mutableStateOf(248.50) }
    var todayRechargesCount by remember { mutableStateOf(142) }
    
    val transactions = remember {
        mutableStateListOf(
            TransactionItem("TXN-1092", "RECHARGE", "01711223344", "Grameenphone", 500.0, "SUCCESS", "04:32 PM"),
            TransactionItem("TXN-1091", "RECHARGE", "01855599012", "Robi Axiata", 1000.0, "SUCCESS", "03:15 PM"),
            TransactionItem("TXN-1090", "P2P_CREDIT", "01911445566", "Banglalink", 2500.0, "SUCCESS", "01:10 PM"),
            TransactionItem("TXN-1089", "RECHARGE", "01555112233", "Teletalk", 150.0, "FAILED", "11:45 AM")
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("RechargeSaaS Mobile", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                        Text("Role: $userRole · Secure Node", fontSize = 11.sp, color = SecondaryDark, fontFamily = FontFamily.Monospace)
                    }
                },
                actions = {
                    IconButton(onClick = onLogout) {
                        Icon(Icons.Default.Logout, contentDescription = "Logout", tint = AccentRose)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = BackgroundDark)
            )
        },
        containerColor = BackgroundDark
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Main Wallet Balance Card
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(SurfaceDark)
                        .border(1.dp, CardBorderDark, RoundedCornerShape(20.dp))
                        .padding(24.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("MAIN LEDGER BALANCE", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = TextSecondaryDark, fontFamily = FontFamily.Monospace)
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(PrimaryDark.copy(alpha = 0.2f))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text("ACTIVE", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = PrimaryDark, fontFamily = FontFamily.Monospace)
                            }
                        }
                        
                        Text(
                            text = "$${String.format("%,.2f", balance)}",
                            fontSize = 32.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = SecondaryDark,
                            fontFamily = FontFamily.SansSerif,
                            modifier = Modifier.padding(vertical = 8.dp)
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("COMMISSION EARNED", fontSize = 9.sp, color = TextSecondaryDark)
                                Text("$${String.format("%,.2f", commissions)}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = AccentEmerald)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("TODAY RECHARGES", fontSize = 9.sp, color = TextSecondaryDark)
                                Text("$todayRechargesCount successful", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                            }
                        }
                    }
                }
            }

            // Quick Actions Title
            item {
                Text(
                    text = "DISPATCH OPERATION DESK",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondaryDark,
                    fontFamily = FontFamily.Monospace,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            // Quick Action Row Items
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    ActionTile(
                        title = "Airtime Top-Up",
                        icon = Icons.Default.Send,
                        color = PrimaryDark,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToRecharge
                    )
                    ActionTile(
                        title = "Wallet Ledger",
                        icon = Icons.Default.AccountBalanceWallet,
                        color = SecondaryDark,
                        modifier = Modifier.weight(1f),
                        onClick = onNavigateToWallet
                    )
                }
            }

            // Recent Double-Entry Ledger Streams Title
            item {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(top = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "RECENT LEDGER HANDSHAKES",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextSecondaryDark,
                        fontFamily = FontFamily.Monospace
                    )
                    Icon(
                        Icons.Default.Refresh,
                        contentDescription = "Refresh",
                        tint = TextSecondaryDark,
                        modifier = Modifier.size(16.dp).clickable { /* Refresh stream */ }
                    )
                }
            }

            // Transactions Stream
            items(transactions) { txn ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(SurfaceDark)
                        .border(1.dp, CardBorderDark, RoundedCornerShape(14.dp))
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(if (txn.status == "SUCCESS") AccentEmerald.copy(alpha = 0.15f) else AccentRose.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (txn.type == "RECHARGE") Icons.Default.Smartphone else Icons.Default.SwapHoriz,
                                contentDescription = txn.type,
                                tint = if (txn.status == "SUCCESS") AccentEmerald else AccentRose,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(txn.number, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
                            Text("${txn.operator} · ${txn.timestamp}", fontSize = 10.sp, color = TextSecondaryDark, fontFamily = FontFamily.Monospace)
                        }
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "-$${String.format("%.2f", txn.amount)}",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (txn.status == "SUCCESS") TextPrimaryDark else TextSecondaryDark
                        )
                        Box(
                            modifier = Modifier
                                .padding(top = 4.dp)
                                .clip(RoundedCornerShape(4.dp))
                                .background(if (txn.status == "SUCCESS") AccentEmerald.copy(alpha = 0.1f) else AccentRose.copy(alpha = 0.1f))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                txn.status,
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (txn.status == "SUCCESS") AccentEmerald else AccentRose,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ActionTile(
    title: String,
    icon: ImageVector,
    color: androidx.compose.ui.graphics.Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceDark)
            .border(1.dp, CardBorderDark, RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .padding(18.dp)
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(color.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = title, tint = color, modifier = Modifier.size(20.dp))
        }
        Spacer(modifier = Modifier.height(12.dp))
        Text(title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextPrimaryDark)
        Text("Click to expand scope", fontSize = 9.sp, color = TextSecondaryDark, modifier = Modifier.padding(top = 2.dp))
    }
}
