$files = @(
    "app\(tabs)\home.jsx",
    "app\(tabs)\community.jsx",
    "app\BudgetOnboarding.jsx"
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Replace fontWeight: 'bold' with fontFamily: 'Poppins-Bold'
        $content = $content -replace "fontWeight:\s*'bold'", "fontFamily: 'Poppins-Bold'"
        $content = $content -replace 'fontWeight:\s*"bold"', "fontFamily: 'Poppins-Bold'"
        
        # Replace fontWeight: '600' with fontFamily: 'Poppins-SemiBold'
        $content = $content -replace "fontWeight:\s*'600'", "fontFamily: 'Poppins-SemiBold'"
        $content = $content -replace 'fontWeight:\s*"600"', "fontFamily: 'Poppins-SemiBold'"
        
        # Replace fontWeight: '500' with fontFamily: 'Poppins-Medium'
        $content = $content -replace "fontWeight:\s*'500'", "fontFamily: 'Poppins-Medium'"
        $content = $content -replace 'fontWeight:\s*"500"', "fontFamily: 'Poppins-Medium'"
        
        # Add fontFamily: 'Poppins-Regular' to styles that don't have fontWeight or fontFamily
        # This is more complex and would need manual review
        
        Set-Content $filePath $content -NoNewline
        Write-Host "Updated $file"
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Font update complete!"
