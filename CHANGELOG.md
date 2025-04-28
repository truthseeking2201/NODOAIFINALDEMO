# Changelog

## Major UI and UX Improvements [2023-04-26]

### User Experience Enhancements

1. **Simplified Vault Interaction**
   - Removed direct pool references (DEEP-SUI, CETUS-SUI, etc.) from the user interface
   - Replaced with category-based descriptors: "Aggressive Vault", "Balanced Vault", "Conservative Vault"
   - All internal pool implementation details are now hidden from users

2. **Wallet Integration**
   - Enhanced wallet connection modal with clearer user flow
   - Improved transaction signature dialog with visual feedback
   - Better error handling for wallet operations

3. **NODOAIx Token Visibility**
   - Added toast notification "NODOAIx Token minted" on successful deposits
   - Created dedicated NODOAIx Token Card in Dashboard
   - Added tooltip explaining token functionality (burns on withdrawal, non-transferable, represents vault share, yields interest)

4. **UI Metrics Refinement**
   - Replaced pie charts and pool tables with three focused headline metrics:
     - Deposited Amount
     - Live APR
     - Total Profit
   - Added risk badge showing vault risk level
   - Added capital deployment indicator showing percentage of funds actively deployed

5. **Activity Feed Organization**
   - Separated activity logs into two clearly defined tabs:
     - AI Activity (algorithmic position adjustments, optimizations)
     - My Transactions (user deposits and withdrawals)

6. **Neural-Orange UI Theme**
   - Standardized CTAs to use Neural-Orange gradient consistently
   - Updated background/cards to dark-neutral color scheme
   - Improved visual hierarchy and content focus

### AI Transparency Features

7. **Nova AI Reasoning Drawer**
   - Implemented detailed AI reasoning panel accessible via "Explain" icon for each AI action
   - Narrative flow structure:
     1. Trigger Detection - What market signal prompted the action
     2. Hypothesis - Expected outcome with APR impact
     3. Evaluation - Pros/cons analysis with visual elements
     4. Decision - Clear summary of the action taken
   - Added visual aids including sparkline, decision-tree visualization, and confidence gauge
   - Implemented "Run Simulation" replay functionality
   - Added human-like closing messages for improved engagement

8. **Risk Visualization**
   - Enhanced risk communication with color-coded badges and indicators
   - Clear labeling of capital deployment ratio
   - Improved transparency around AI strategy decisions

### Technical Improvements

9. **Code Organization**
   - Improved component structure and naming conventions
   - Enhanced data flow between components
   - Better state management for wallet integration

10. **Performance Optimizations**
    - Reduced unnecessary re-renders
    - Improved loading state visualizations
    - More efficient data transformations
