on run argv
	set pageURL to item 1 of argv
	set outputPath to item 2 of argv
	set loadDelay to (item 3 of argv) as number
	set paperName to item 4 of argv
	set outputFolder to do shell script "dirname " & quoted form of outputPath
	set outputName to do shell script "basename " & quoted form of outputPath

	tell application "Safari"
		activate
		make new document with properties {URL:pageURL}
	end tell
	delay loadDelay

	tell application "System Events"
		tell process "Safari"
			set frontmost to true
			repeat 3 times
				keystroke "p" using command down
				if my waitUpTo(a reference to sheet 1 of window 1, 20) then exit repeat
			end repeat
			my waitFor(a reference to sheet 1 of window 1)
			set printSheet to sheet 1 of window 1
			my selectPaper(printSheet, paperName)
			my setCheckbox(printSheet, "Print headers and footers", 0)
			my setCheckbox(printSheet, "Print backgrounds", 1)
			delay 1
			set pdfButton to my findPdfButton(printSheet)
			click pdfButton
			my waitFor(a reference to (first menu item of menu 1 of pdfButton whose name starts with "Save as PDF"))
			click (first menu item of menu 1 of pdfButton whose name starts with "Save as PDF")
			my waitForSavePanel()
			delay 1
			keystroke "a" using command down
			keystroke outputName
			keystroke "g" using {command down, shift down}
			delay 1
			keystroke outputFolder
			keystroke return
			delay 1
			keystroke return
		end tell
	end tell

	repeat 120 times
		if (do shell script "test -s " & quoted form of outputPath & " && echo yes || echo no") is "yes" then exit repeat
		delay 0.5
	end repeat
	delay 1

	tell application "Safari" to close document 1
end run

on waitFor(target)
	repeat 60 times
		tell application "System Events"
			if exists target then return
		end tell
		delay 0.5
	end repeat
	error "timeout"
end waitFor

on findPdfButton(printSheet)
	tell application "System Events"
		if exists menu button "PDF" of printSheet then return menu button "PDF" of printSheet
	end tell
	set found to my findElement(printSheet, "AXMenuButton", "description", "PDF", 3)
	if found is missing value then error "PDF menu button not found"
	return found
end findPdfButton

on findElement(parentElement, roleName, attributeName, attributeText, depth)
	tell application "System Events"
		try
			set kids to UI elements of parentElement
		on error
			return missing value
		end try
		repeat with kid in kids
			try
				set kid to contents of kid
				if role of kid is roleName then
					if attributeName is "description" and description of kid is attributeText then return kid
					if attributeName is "name" and name of kid is attributeText then return kid
				end if
				if depth > 0 then
					set found to my findElement(kid, roleName, attributeName, attributeText, depth - 1)
					if found is not missing value then return found
				end if
			end try
		end repeat
	end tell
	return missing value
end findElement

on waitForSavePanel()
	repeat 20 times
		tell application "System Events"
			tell process "Safari"
				if exists text field 1 of sheet 1 of sheet 1 of window 1 then return
				if exists text field 1 of sheet 1 of window 1 then return
			end tell
		end tell
		delay 0.5
	end repeat
end waitForSavePanel

on findPaperPopup(parentElement, depth)
	tell application "System Events"
		try
			set kids to UI elements of parentElement
		on error
			return missing value
		end try
		repeat with kid in kids
			try
				set kid to contents of kid
				if role of kid is "AXGroup" and (exists static text "Paper Size" of kid) then return pop up button 1 of kid
				if depth > 0 then
					set found to my findPaperPopup(kid, depth - 1)
					if found is not missing value then return found
				end if
			end try
		end repeat
	end tell
	return missing value
end findPaperPopup

on selectPaper(printSheet, paperName)
	set paperPopup to my findPaperPopup(printSheet, 3)
	if paperPopup is missing value then error "Paper Size pop up button not found"
	tell application "System Events"
		click paperPopup
		my waitFor(a reference to menu 1 of paperPopup)
		set candidates to (menu items of menu 1 of paperPopup whose name starts with paperName)
		if candidates is {} then
			set menuNames to name of menu items of menu 1 of paperPopup
			key code 53
			set AppleScript's text item delimiters to ", "
			error "paper " & paperName & " not in: " & (menuNames as text)
		end if
		click item 1 of candidates
	end tell
end selectPaper

on setCheckbox(printSheet, checkboxName, wanted)
	set checkboxElement to my findElement(printSheet, "AXCheckBox", "name", checkboxName, 4)
	if checkboxElement is missing value then error checkboxName & " checkbox not found"
	tell application "System Events"
		if (value of checkboxElement as integer) is not wanted then click checkboxElement
	end tell
end setCheckbox

on waitUpTo(target, attempts)
	repeat attempts times
		tell application "System Events"
			if exists target then return true
		end tell
		delay 0.5
	end repeat
	return false
end waitUpTo
